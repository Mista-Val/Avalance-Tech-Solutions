// Contact Item Component
class ContactItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['icon', 'title'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  render() {
    const icon = window.getIcon ? window.getIcon(this.icon) : '';
    const title = this.title ? `<h4>${this.title}</h4>` : '';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1.5rem;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          transition: all 0.3s ease;
        }
        .contact-icon {
          margin-right: 1rem;
          color: #3b82f6;
          min-width: 24px;
          text-align: center;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }
        .contact-content {
          flex: 1;
        }
        h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #1e293b;
        }
        p, a {
          margin: 0 0 0.5rem 0;
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
          text-decoration: none;
          display: block;
        }
        a:hover {
          color: #3b82f6;
        }
        @media (max-width: 767.98px) {
          .contact-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .contact-icon {
            margin: 0 0 0.75rem 0;
            font-size: 1.5rem;
          }
        }
      </style>
      <div class="contact-item">
        <div class="contact-icon">${icon}</div>
        <div class="contact-content">
          ${title}
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// Define the custom element
if (!customElements.get('contact-item')) {
  customElements.define('contact-item', ContactItem);
}
