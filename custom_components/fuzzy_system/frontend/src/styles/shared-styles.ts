import { css } from "lit";

export const sharedStyles = css`
  :host {
    --fuzzy-primary: var(--primary-color, #0284c7);
    --fuzzy-primary-hover: var(--primary-color-hover, #0369a1);
    --fuzzy-accent: var(--accent-color, #d97706);
    --fuzzy-success: var(--success-color, #059669);
    --fuzzy-warning: var(--warning-color, #d97706);
    --fuzzy-danger: var(--error-color, #ef4444);
    --fuzzy-bg: var(--primary-background-color, #0f172a);
    --fuzzy-card-bg: var(--card-background-color, rgba(30, 41, 59, 0.7));
    --fuzzy-card-border: var(--divider-color, rgba(125, 125, 125, 0.2));
    --fuzzy-text: var(--primary-text-color, #f8fafc);
    --fuzzy-text-secondary: var(--secondary-text-color, #64748b);
    --fuzzy-glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
    --fuzzy-radius-lg: 16px;
    --fuzzy-radius-md: 10px;
    --fuzzy-radius-sm: 6px;
    font-family: var(--ha-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    color: var(--fuzzy-text);
  }

  .container {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  /* Glassmorphic Cards */
  .card {
    background: var(--fuzzy-card-bg);
    border: 1px solid var(--fuzzy-card-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: var(--fuzzy-radius-lg);
    box-shadow: var(--fuzzy-glass-shadow);
    padding: 24px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .card:hover {
    border-color: rgba(2, 132, 199, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.25);
  }

  /* Typography */
  h1, h2, h3, h4, p {
    margin: 0;
  }

  .title-lg {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--primary-text-color, #f8fafc);
  }

  .subtitle {
    font-size: 14px;
    color: var(--fuzzy-text-secondary);
    margin-top: 4px;
  }

  /* Badges & Chips */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    border-radius: 9999px;
    line-height: 1.2;
  }

  .badge-cyan {
    background: #0284c7;
    color: #ffffff;
    border: 1px solid #0369a1;
  }

  .badge-amber {
    background: #d97706;
    color: #ffffff;
    border: 1px solid #b45309;
  }

  .badge-emerald {
    background: #059669;
    color: #ffffff;
    border: 1px solid #047857;
  }

  .badge-purple {
    background: #7c3aed;
    color: #ffffff;
    border: 1px solid #6d28d9;
  }

  .badge-rose {
    background: #e11d48;
    color: #ffffff;
    border: 1px solid #be123c;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    background: var(--chip-background-color, var(--secondary-background-color, rgba(125, 125, 125, 0.12)));
    border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.2));
    border-radius: var(--fuzzy-radius-sm);
    color: var(--primary-text-color, var(--fuzzy-text));
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: var(--fuzzy-radius-md);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    outline: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
    box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--secondary-background-color, rgba(125, 125, 125, 0.08));
    color: var(--primary-text-color, var(--fuzzy-text));
    border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.25));
  }

  .btn-secondary:hover {
    background: rgba(125, 125, 125, 0.16);
    border-color: rgba(125, 125, 125, 0.4);
    transform: translateY(-1px);
  }

  .btn-danger {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.4);
    font-weight: 600;
  }

  .btn-danger:hover {
    background: #dc2626;
    color: #ffffff;
    border-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
  }

  .btn-icon {
    padding: 8px;
    border-radius: 50%;
    background: transparent;
    color: var(--fuzzy-text-secondary);
  }

  .btn-icon:hover {
    background: rgba(125, 125, 125, 0.12);
    color: var(--primary-text-color, var(--fuzzy-text));
  }

  /* Form Inputs */
  .form-group {
    margin-bottom: 18px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color, #1e293b);
    opacity: 0.9;
    margin-bottom: 6px;
  }

  .input-text, .input-select, .input-textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--fuzzy-radius-md);
    background: var(--input-fill-color, var(--card-background-color, #ffffff));
    border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.3));
    color: var(--primary-text-color, #0f172a);
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .input-text::placeholder, .input-textarea::placeholder {
    color: var(--secondary-text-color, #94a3b8);
    opacity: 0.8;
  }

  .input-select option {
    background: var(--card-background-color, #ffffff);
    color: var(--primary-text-color, #0f172a);
  }

  .input-text:focus, .input-select:focus, .input-textarea:focus {
    outline: none;
    border-color: var(--fuzzy-primary);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.25);
  }

  /* Modal Backdrop */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 16px;
  }

  .modal-content {
    background: var(--card-background-color, var(--fuzzy-bg));
    border: 1px solid var(--fuzzy-card-border);
    border-radius: var(--fuzzy-radius-lg);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 28px;
    box-sizing: border-box;
    color: var(--primary-text-color, var(--fuzzy-text));
  }
`;
