/**
 * Opens a new browser window with the given HTML content + styles and triggers print.
 * @param {string} htmlContent  - The inner HTML string to print
 * @param {string} title        - Window/document title
 */
export function printContent(htmlContent, title = 'Print') {
  const win = window.open('', '_blank', 'width=302,height=100');
  if (!win) {
    alert('Pop-up blocked! Please allow pop-ups for this site and try again.');
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: 'Courier New', Courier, monospace;
          background: white;
          color: #000;
          width: 80mm;
          height: auto !important;
          overflow: hidden;
          font-weight: 600;
        }

        /* ── RECEIPT ── */
        .receipt {
          width: 80mm;
          font-size: 12px;
          line-height: 1.6;
          padding: 8px;
          font-weight: 600;
        }
        .receipt-logo {
          display: block;
          margin: 0 auto 4px auto;
          max-width: 60px;
          max-height: 60px;
          object-fit: contain;
        }
        .receipt-title {
          font-size: 18px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 2px;
          letter-spacing: 1px;
        }
        .receipt-sub {
          text-align: center;
          font-size: 10px;
          color: #000;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .receipt-divider {
          border: none;
          border-top: 1px dashed #000;
          margin: 8px 0;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
        }
        .receipt-row span {
          font-weight: 600;
          color: #000;
        }
        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          font-weight: 900;
          font-size: 15px;
          color: #000;
        }
        .receipt-footer {
          text-align: center;
          margin-top: 4px;
          font-size: 11px;
          font-weight: 800;
          color: #000;
          letter-spacing: 0.5px;
        }
        .receipt-exchange {
          text-align: center;
          margin-top: 4px;
          margin-bottom: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #000;
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 3px 0;
        }

        /* ── PRICE TAGS ── */
        .tags-page {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 2px;
        }
        .price-tag-card {
          border: 2px solid #222;
          border-radius: 8px;
          padding: 4px 6px;
          text-align: center;
          width: 50mm;
          page-break-inside: avoid;
          break-inside: avoid;
          color: #000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
        }
        .price-tag-shop {
          font-size: 8px;
          color: #000;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 700;
        }
        .price-tag-divider {
          border: none;
          border-top: 1px solid #000;
          width: 100%;
          margin: 2px 0;
        }
        .price-tag-name {
          font-size: 12px;
          font-weight: 800;
          word-break: break-word;
          color: #000;
        }
        .price-tag-meta {
          font-size: 9px;
          color: #000;
        }
        .price-tag-cost {
          font-size: 9px;
          color: #000;
        }
        .price-tag-price {
          font-size: 20px;
          font-weight: 900;
          color: #000;
          line-height: 1.1;
        }
        .price-tag-currency {
          font-size: 11px;
          font-weight: 700;
        }
        .price-tag-barcode {
          display: block;
          width: 140px;
          height: 48px;
          margin: 2px auto;
          object-fit: contain;
          image-rendering: pixelated;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .price-tag-code {
          font-size: 8px;
          color: #000;
          letter-spacing: 1px;
          font-weight: 700;
          font-family: 'Courier New', Courier, monospace;
        }

        @media print {
          html, body {
            width: 80mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
          .price-tag-barcode {
            display: block !important;
            width: 140px !important;
            height: 48px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `);

  win.document.close();

  win.onload = () => {
    setTimeout(() => {
      const body = win.document.body;
      const height = body.scrollHeight;
      win.resizeTo(302, height + 50);
      win.focus();
      win.print();
      win.close();
    }, 800);
  };

  // Fallback if onload doesn't fire
  setTimeout(() => {
    try {
      win.focus();
      win.print();
      win.close();
    } catch (_) {}
  }, 2000);
}