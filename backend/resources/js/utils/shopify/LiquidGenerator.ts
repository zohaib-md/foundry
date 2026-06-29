import { BuilderComponent, ComponentStyles } from '../../types/builder';

export interface LiquidExport {
  html: string;
  schema: any[];
  blocks: any[];
  presetBlocks: any[];
}

export class LiquidGenerator {
  /**
   * Compiles a top-level section component into a full Shopify Liquid section file string.
   */
  public generateSectionFile(component: BuilderComponent, sectionName: string): string {
    const exportData = this.generateComponentLiquid(component);
    
    const schema = {
      name: sectionName,
      settings: exportData.schema,
      blocks: exportData.blocks,
      presets: [
        {
          name: sectionName,
          category: "Foundry Generated",
          blocks: exportData.presetBlocks
        }
      ]
    };

    return `
<div class="foundry-section-${component.id}" style="${this.generateStyleString(component.styles)}">
${exportData.html}
</div>

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}
    `.trim();
  }

  /**
   * Recursively generates Liquid HTML and aggregates settings schema.
   */
  public generateComponentLiquid(component: BuilderComponent, context: 'section' | 'block' = 'section'): LiquidExport {
    let html = '';
    let schema: any[] = [];
    let blocks: any[] = [];
    let presetBlocks: any[] = [];
    
    // Helper to determine the settings prefix based on context
    const settingsPrefix = context === 'block' ? 'block.settings' : 'section.settings';

    // Process component based on type
    switch (component.type) {
      case 'heading': {
        const boundText = component.bindings?.text;
        let textOutput = '';

        if (boundText) {
          textOutput = `{{ ${boundText} }}`;
        } else if (/\{\{?\s*[^}]+\s*\}?\}/.test(component.props.text || '')) {
          textOutput = (component.props.text || '').replace(/\{\{?\s*([^}]+)\s*\}?\}/g, '{{ $1 }}');
        } else {
          const textSettingId = `${component.id}_text`;
          schema.push({
            type: "text",
            id: textSettingId,
            label: "Heading Text",
            default: component.props.text || "Heading"
          });
          textOutput = `{{ ${settingsPrefix}.${textSettingId} }}`;
        }

        const tag = component.props.level || 'h2';
        html = `<${tag} style="${this.generateStyleString(component.styles)}">${textOutput}</${tag}>`;
        break;
      }
      
      case 'text': {
        const boundText = component.bindings?.text;
        let textOutput = '';

        if (boundText) {
          textOutput = `{{ ${boundText} }}`;
        } else if (/\{\{?\s*[^}]+\s*\}?\}/.test(component.props.text || '')) {
          textOutput = `<p>${(component.props.text || '').replace(/\{\{?\s*([^}]+)\s*\}?\}/g, '{{ $1 }}')}</p>`;
        } else {
          const textSettingId = `${component.id}_text`;
          schema.push({
            type: "richtext",
            id: textSettingId,
            label: "Body Text",
            default: `<p>${component.props.text || "Paragraph text"}</p>`
          });
          textOutput = `{{ ${settingsPrefix}.${textSettingId} }}`;
        }

        html = `<div style="${this.generateStyleString(component.styles)}">${textOutput}</div>`;
        break;
      }
      
      case 'button': {
        const boundText = component.bindings?.text;
        const boundUrl = component.bindings?.url;
        
        let textOutput = '';
        if (boundText) {
          textOutput = `{{ ${boundText} }}`;
        } else if (/\{\{?\s*[^}]+\s*\}?\}/.test(component.props.text || '')) {
          textOutput = (component.props.text || '').replace(/\{\{?\s*([^}]+)\s*\}?\}/g, '{{ $1 }}');
        } else {
          const textSettingId = `${component.id}_text`;
          schema.push({
            type: "text",
            id: textSettingId,
            label: "Button Text",
            default: component.props.text || "Click Me"
          });
          textOutput = `{{ ${settingsPrefix}.${textSettingId} }}`;
        }

        let linkOutput = '';
        if (boundUrl) {
          linkOutput = `{{ ${boundUrl} }}`;
        } else {
          const linkSettingId = `${component.id}_link`;
          schema.push({
            type: "url",
            id: linkSettingId,
            label: "Button Link"
          });
          linkOutput = `{{ ${settingsPrefix}.${linkSettingId} }}`;
        }

        html = `<a href="${linkOutput}" style="${this.generateStyleString(component.styles)}">${textOutput}</a>`;
        break;
      }

      case 'image': {
        const boundImage = component.bindings?.url;
        
        if (boundImage) {
          // If we bind to a Shopify object, it usually outputs an image object or URL directly
          // Assuming the bound property is an image object, we pipe it to img_url
          html = `<img src="{{ ${boundImage} | img_url: 'master' }}" alt="{{ ${boundImage}.alt | escape }}" style="${this.generateStyleString(component.styles)}" />`;
        } else {
          const imageSettingId = `${component.id}_image`;
          schema.push({
            type: "image_picker",
            id: imageSettingId,
            label: "Image"
          });
          html = `
{% if ${settingsPrefix}.${imageSettingId} != blank %}
  <img src="{{ ${settingsPrefix}.${imageSettingId} | img_url: 'master' }}" alt="{{ ${settingsPrefix}.${imageSettingId}.alt | escape }}" style="${this.generateStyleString(component.styles)}" />
{% else %}
  <div class="placeholder-image" style="${this.generateStyleString(component.styles)}; background: #eee;"></div>
{% endif %}
          `.trim();
        }
        break;
      }
      
      case 'container':
      case 'section': {
        // Wrapper element that renders children
        let childrenHtml = '';
        if (component.children && component.children.length > 0) {
          component.children.forEach(child => {
            const childExport = this.generateComponentLiquid(child, context);
            childrenHtml += '\\n' + childExport.html;
            schema = schema.concat(childExport.schema);
            blocks = blocks.concat(childExport.blocks);
            presetBlocks = presetBlocks.concat(childExport.presetBlocks);
          });
        }
        
        html = `<div style="${this.generateStyleString(component.styles)}">${childrenHtml}\\n</div>`;
        break;
      }
      
      case 'columns':
      case 'grid': {
        // These are treated as Block Areas in Shopify.
        let caseStatements = '';
        
        if (component.children && component.children.length > 0) {
          component.children.forEach((child, index) => {
            // Generate the child in 'block' context so it outputs block.settings
            const childExport = this.generateComponentLiquid(child, 'block');
            
            const blockType = `block_${child.id}`;
            const blockName = `Column ${index + 1}`;
            
            // Add block definition to the section schema
            blocks.push({
              type: blockType,
              name: blockName,
              settings: childExport.schema
            });
            
            // Add block to presets so it appears by default
            presetBlocks.push({
              type: blockType
            });
            
            // Add case statement for the Liquid loop
            caseStatements += `
    {% when '${blockType}' %}
      <div class="foundry-block-${child.id}" {{ block.shopify_attributes }}>
        ${childExport.html}
      </div>`;
          });
        }
        
        html = `
<div style="${this.generateStyleString(component.styles)}">
  {% for block in section.blocks %}
    {% case block.type %}${caseStatements}
    {% endcase %}
  {% endfor %}
</div>`.trim();
        break;
      }
      
      default: {
        // Fallback for unmapped components
        html = `<!-- Unsupported component: ${component.type} -->`;
        break;
      }
    }

    return { html, schema, blocks, presetBlocks };
  }

  /**
   * Converts a ComponentStyles object into a raw CSS inline style string.
   */
  private generateStyleString(styles?: ComponentStyles): string {
    if (!styles) return '';
    
    const styleParts: string[] = [];
    
    // Mapping camelCase properties to kebab-case
    if (styles.fontFamily) styleParts.push(`font-family: ${styles.fontFamily}`);
    if (styles.fontSize) styleParts.push(`font-size: ${styles.fontSize}`);
    if (styles.fontWeight) styleParts.push(`font-weight: ${styles.fontWeight}`);
    if (styles.paddingTop) styleParts.push(`padding-top: ${styles.paddingTop}`);
    if (styles.paddingBottom) styleParts.push(`padding-bottom: ${styles.paddingBottom}`);
    if (styles.color) styleParts.push(`color: ${styles.color}`);
    if (styles.textAlign) styleParts.push(`text-align: ${styles.textAlign}`);
    if (styles.width) styleParts.push(`width: ${styles.width}`);
    if (styles.minHeight) styleParts.push(`min-height: ${styles.minHeight}`);
    if (styles.display) styleParts.push(`display: ${styles.display}`);
    if (styles.flexDirection) styleParts.push(`flex-direction: ${styles.flexDirection}`);
    if (styles.alignItems) styleParts.push(`align-items: ${styles.alignItems}`);
    if (styles.justifyContent) styleParts.push(`justify-content: ${styles.justifyContent}`);
    if (styles.gap) styleParts.push(`gap: ${styles.gap}`);
    if (styles.padding) styleParts.push(`padding: ${styles.padding}`);
    if (styles.backgroundColor) styleParts.push(`background-color: ${styles.backgroundColor}`);
    if (styles.borderRadius) styleParts.push(`border-radius: ${styles.borderRadius}`);
    if (styles.customCss) styleParts.push(styles.customCss);
    
    return styleParts.join('; ');
  }
}
