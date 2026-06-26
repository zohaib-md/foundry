import type { BuilderComponent } from '../types/builder';

export function generateHtmlCode(components: BuilderComponent[]): string {
  const indent = (str: string, level: number) => {
    const spaces = '  '.repeat(level);
    return str.split('\n').map(line => line ? spaces + line : line).join('\n');
  };

  const styleObjectToString = (styles: any) => {
    if (!styles) return '';
    return Object.entries(styles)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabKey}: ${value};`;
      })
      .join(' ');
  };

  const processComponent = (comp: BuilderComponent): string => {
    let html = '';
    const styles = styleObjectToString(comp.styles);
    const styleAttr = styles ? ` style="${styles}"` : '';

    switch (comp.type) {
      case 'container':
        html += `<div class="container"${styleAttr}>\n`;
        if (comp.children && comp.children.length > 0) {
          comp.children.forEach(child => {
            html += indent(processComponent(child), 1) + '\n';
          });
        }
        html += `</div>`;
        break;
      
      case 'heading':
        const levelTag = comp.props.level || 'h2';
        html += `<${levelTag}${styleAttr}>${comp.props.text}</${levelTag}>`;
        break;

      case 'text':
        html += `<p${styleAttr}>${comp.props.text}</p>`;
        break;

      case 'button':
        const btnClass = comp.props.variant === 'primary' 
          ? 'btn btn-primary' 
          : (comp.props.variant === 'secondary' ? 'btn btn-secondary' : 'btn btn-outline');
        html += `<a href="${comp.props.url || '#'}" class="${btnClass}"${styleAttr}>${comp.props.text}</a>`;
        break;

      case 'image':
        html += `<img src="${comp.props.url}" alt="${comp.props.altText || ''}"${styleAttr} />`;
        break;
        
      default:
        html += `<!-- Unknown component type: ${comp.type} -->`;
    }

    return html;
  };

  let result = '<div class="foundry-page">\n';
  components.forEach(comp => {
    result += indent(processComponent(comp), 1) + '\n';
  });
  result += '</div>';

  return result;
}

export function generateVueCode(components: BuilderComponent[]): string {
  const htmlContent = generateHtmlCode(components);
  
  return `<template>
${htmlContent}
</template>

<style scoped>
/* Base Styles for Exported Components */
.foundry-page {
  font-family: system-ui, -apple-system, sans-serif;
  color: #171717;
}

.container {
  box-sizing: border-box;
  max-width: 100%;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #171717;
  color: #ffffff;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #171717;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #e5e5e5;
  color: #171717;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}
</style>
`;
}
