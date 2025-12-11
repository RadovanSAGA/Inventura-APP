import type { InventoryItem } from '../types';
import './ExportPreview.css';

interface ExportPreviewProps {
  items: InventoryItem[];
  onClose: () => void;
}

export function ExportPreview({ items, onClose }: ExportPreviewProps) {
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('sk-SK');
  const timeStr = currentDate.toLocaleTimeString('sk-SK');

  // Rozdelenie na strany (25 položiek/strana)
  const itemsPerPage = 25;
  const pages: InventoryItem[][] = [];

  for (let i = 0; i < items.length; i += itemsPerPage) {
    const pageItems = items.slice(i, i + itemsPerPage);
    if (pageItems.length > 0) {
      pages.push(pageItems);
    }
  }

  const totalPages = pages.length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const header = 'IL.,Číslo položky,Stav,Popis,Baliaca jednotka,Hodnota J1,Čiastková jednotka,Hodnota J2,Jednotka,Hodnota J3';
    
    const rows = items.map(item => [
      'MRA',
      item.cisloPolozky,
      'Aktívne',
      item.popis,
      item.baliacaJednotka,
      item.hodnota1 && item.hodnota1 > 0 ? item.hodnota1 : '----',
      item.castkovaJedno,
      item.hodnota2 && item.hodnota2 > 0 ? item.hodnota2 : '----',
      item.jednotka,
      item.hodnota3 && item.hodnota3 > 0 ? item.hodnota3 : '----'
    ].map(val => `"${val}"`).join(','));

    const csvContent = `Formulár inventúry / Deň (Dynamický) / Umiestnenie všetkých položiek\n${dateStr}\n\nReštika\n\n${header}\n${rows.join('\n')}`;
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `inventura_${currentDate.toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="export-preview-overlay" onClick={onClose}>
      <div className="export-preview-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="export-header no-print">
          <div>
            <h2>📊 Náhľad exportu</h2>
            <p className="export-subtitle">INVENTURA {dateStr}</p>
          </div>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="print-document">
          
          {/* KAŽDÁ STRANA SAMOSTATNE */}
          {pages.map((pageItems, pageIndex) => (
            <div key={pageIndex} className="page-container">
              
              {/* HLAVIČKA */}
              <div className="document-header">
                <div className="header-left">
                  <div>Dátum: <strong>{dateStr}</strong></div>
                  <div>Čas: <strong>{timeStr}</strong></div>
                </div>
                <div className="header-center">
                  <div><strong>ŽILINA</strong></div>
                  <div><strong>VYSOKOŠKOLÁKOV</strong></div>
                  <div><strong>010 01 ŽILINA</strong></div>
                </div>
                <div className="header-right">
                  <div>Stránka <strong>{pageIndex + 1} / {totalPages}</strong></div>
                  <div>Rešt.: <strong>{items.length}</strong></div>
                </div>
              </div>

              {/* NADPIS - LEN NA PRVEJ STRANE */}
              {pageIndex === 0 && (
                <>
                  <div className="document-title">
                    <div className="title-main">Formulár inventúry / Deň (Dynamický) / Umiestnenie všetkých položiek</div>
                    <div className="title-date">{dateStr}, st</div>
                  </div>
                  <div className="section-name">Reštika</div>
                </>
              )}

              {/* TABUĽKA */}
              <table className="document-table">
                <thead>
                  <tr>
                    <th className="th-il">IL.</th>
                    <th className="th-cislo">Číslo položky</th>
                    <th className="th-stav">Stav</th>
                    <th className="th-popis">Popis</th>
                    <th className="th-baliaca">Baliaca jednotka</th>
                    <th className="th-castkova">Čiastková jednotka</th>
                    <th className="th-jednotka">Jednotka</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item) => (
                    <tr key={item.id}>
                      <td className="td-il">MRA</td>
                      <td className="td-cislo">{item.cisloPolozky}</td>
                      <td className="td-stav">Aktívne</td>
                      <td className="td-popis">{item.popis}</td>
                      <td className="td-baliaca">
                        <div className="unit-cell">
                          <span className="unit-label">{item.baliacaJednotka}</span>
                          <span className="unit-value">
                            {item.hodnota1 && item.hodnota1 > 0 ? item.hodnota1 : '----'}
                          </span>
                        </div>
                      </td>
                      <td className="td-castkova">
                        <div className="unit-cell">
                          <span className="unit-label">{item.castkovaJedno}</span>
                          <span className="unit-value">
                            {item.hodnota2 && item.hodnota2 > 0 ? item.hodnota2 : '----'}
                          </span>
                        </div>
                      </td>
                      <td className="td-jednotka">
                        <div className="unit-cell">
                          <span className="unit-label">{item.jednotka}</span>
                          <span className="unit-value">
                            {item.hodnota3 && item.hodnota3 > 0 ? item.hodnota3 : '----'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PÄTIČKA */}
              <div className="document-footer">
                Stránka <strong>{pageIndex + 1} / {totalPages}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="export-actions no-print">
          <button onClick={onClose} className="btn-cancel">Zrušiť</button>
          <button onClick={handleDownloadCSV} className="btn-download">💾 Stiahnuť CSV</button>
          <button onClick={handlePrint} className="btn-print">🖨️ Vytlačiť</button>
        </div>

        <div className="export-info no-print">
          📋 Vytlačí sa <strong>{totalPages} strán</strong> ({items.length} položiek)
        </div>
      </div>
    </div>
  );
}