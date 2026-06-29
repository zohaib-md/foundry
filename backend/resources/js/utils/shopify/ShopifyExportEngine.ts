import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { LiquidGenerator } from './LiquidGenerator';
import { BuilderComponent } from '../../types/builder';

export class ShopifyExportEngine {
  private liquidGen = new LiquidGenerator();

  /**
   * Generates a complete Shopify Theme ZIP file from a Foundry page layout.
   */
  public async exportTheme(pageComponents: BuilderComponent[], themeName: string = 'Foundry-Export') {
    const zip = new JSZip();

    // 1. Generate Layout (theme.liquid)
    const layoutFolder = zip.folder('layout');
    layoutFolder?.file('theme.liquid', this.getThemeLiquidTemplate());

    // 2. Generate Sections
    const sectionsFolder = zip.folder('sections');
    const templatesFolder = zip.folder('templates');
    
    // We will build the index.json template layout dynamically based on sections
    const indexJson = {
      name: "Home Page",
      wrapper: "main",
      sections: {} as Record<string, any>,
      order: [] as string[]
    };

    // Iterate through top-level components to create sections
    pageComponents.forEach((component, index) => {
      const sectionId = `foundry_section_${component.id}`;
      const sectionName = `Foundry ${component.type.charAt(0).toUpperCase() + component.type.slice(1)} ${index + 1}`;
      
      // Compile liquid for this specific top-level component
      const liquidOutput = this.liquidGen.generateSectionFile(component, sectionName);
      sectionsFolder?.file(`${sectionId}.liquid`, liquidOutput);

      // Add to index.json template
      indexJson.sections[sectionId] = {
        type: sectionId,
        settings: {}
      };
      indexJson.order.push(sectionId);
    });

    // 3. Write index.json
    templatesFolder?.file('index.json', JSON.stringify(indexJson, null, 2));

    // 4. Generate Assets and Config (Stubs for now)
    const assetsFolder = zip.folder('assets');
    assetsFolder?.file('base.css', '/* Foundry Generated CSS */\\nbody { margin: 0; padding: 0; }');

    const configFolder = zip.folder('config');
    configFolder?.file('settings_schema.json', JSON.stringify([
      {
        name: "Theme Info",
        theme_name: themeName,
        theme_author: "Foundry Builder",
        theme_version: "1.0.0"
      }
    ], null, 2));

    // Generate and Download ZIP
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${themeName}.zip`);
  }

  /**
   * Provides the boilerplate Shopify theme.liquid wrapper
   */
  private getThemeLiquidTemplate(): string {
    return `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="">
    <link rel="canonical" href="{{ canonical_url }}">
    
    <title>{{ page_title }}</title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {{ content_for_header }}
    
    {{ 'base.css' | asset_url | stylesheet_tag }}
  </head>

  <body>
    <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>
  </body>
</html>`;
  }
}
