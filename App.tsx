
import React, { useState, useEffect, useCallback } from 'react';
import { FALLBACK_PAGES, EXPANDED_FALLBACK_PAGES, BASE_URL, CATEGORY_URL, CORS_PROXIES } from './constants';
import { CorsProxy } from './types'; // Ensure CorsProxy type is available if needed, though constants.ts provides typed CORS_PROXIES

const App: React.FC = () => {
  const [dynamicPages, setDynamicPages] = useState<string[]>(FALLBACK_PAGES);
  const [infoMessage, setInfoMessage] = useState<string>('Cargando contenido dinámico de <strong>Elden Ring Nightreign</strong>...');
  const [buttonText, setButtonText] = useState<string>('¡Manifiesta tu Legado!');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const parseNightreignHtml = useCallback((html: string): string[] => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a[href*="/wiki/"]');
      const nightreignPages: string[] = [];

      links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent?.trim() || '';

        if (href && href.includes('/wiki/')) {
          const pageName = href.replace('/wiki/', '').replace('https://eldenring.fandom.com/wiki/', '');
          
          const lowerText = text.toLowerCase();
          const lowerHref = href.toLowerCase();

          if (
            (lowerText.includes('nightreign') ||
             lowerText.includes('nightlord') ||
             lowerText.includes('nightfarer') ||
             lowerText.includes('limveld') ||
             lowerText.includes('night') || 
             lowerText.includes('spectral') ||
             lowerText.includes('garb') ||
             lowerHref.includes('nightreign') || 
             href.includes('Category:')) && 
            pageName &&
            !nightreignPages.includes(pageName) &&
            pageName !== 'Category:Elden_Ring_Nightreign' &&
            !pageName.includes('File:') &&
            !pageName.includes('User:') &&
            !pageName.includes('Special:') &&
            !pageName.includes('Help:') &&
            !pageName.includes('Template:')
          ) {
            nightreignPages.push(pageName);
          }
        }
      });
      return nightreignPages;
    } catch (error) {
      console.error('Error al parsear HTML:', error);
      return [];
    }
  }, []);

  const fetchNightreignPages = useCallback(async () => {
    setIsButtonDisabled(true);
    setButtonText('Explorando Nightreign...');
    let success = false;
    let fetchedHtml = '';

    for (const proxy of CORS_PROXIES) { // proxy is now correctly typed as CorsProxy
        try {
            console.log(`Intentando con proxy método ${proxy.method}...`);
            const response = await fetch(proxy.url(CATEGORY_URL));
            if (response.ok) {
                if (proxy.needsJsonParse) {
                    const data = await response.json();
                    fetchedHtml = data.contents; 
                } else {
                    fetchedHtml = await response.text();
                }
                
                const parsed = parseNightreignHtml(fetchedHtml);
                if (parsed.length > 0) {
                    const combinedPages = [...new Set([...parsed, ...FALLBACK_PAGES, ...EXPANDED_FALLBACK_PAGES])];
                    setDynamicPages(combinedPages);
                    setInfoMessage(`¡${combinedPages.length} elementos de Nightreign encontrados dinámicamente! Haz clic para explorar.`);
                    success = true;
                    break; 
                } else {
                     console.log(`Proxy método ${proxy.method} devolvió contenido, pero no se encontraron páginas relevantes.`);
                }
            } else {
                console.log(`Proxy método ${proxy.method} falló con estado: ${response.status}`);
            }
        } catch (e) {
            console.warn(`Error con proxy método ${proxy.method}:`, e);
        }
    }

    if (!success) {
      console.log('Todos los métodos de proxy fallaron o no encontraron contenido, usando lista expandida de respaldo.');
      setDynamicPages(EXPANDED_FALLBACK_PAGES);
      setInfoMessage(`Usando lista expandida de Nightreign (${EXPANDED_FALLBACK_PAGES.length} elementos). Haz clic para explorar.`);
    }

    setButtonText('¡Manifiesta tu Legado!');
    setIsButtonDisabled(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parseNightreignHtml]);

  useEffect(() => {
    setInfoMessage('Iniciando explorador de Nightreign...');
    
    fetchNightreignPages(); 

    let refreshIntervalId: number | undefined;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (refreshIntervalId) clearInterval(refreshIntervalId);
      } else {
        fetchNightreignPages(); 
        refreshIntervalId = window.setInterval(() => {
          fetchNightreignPages();
        }, 5 * 60 * 1000); 
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (!document.hidden) { 
        refreshIntervalId = window.setInterval(() => {
          fetchNightreignPages();
        }, 5 * 60 * 1000);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (refreshIntervalId) clearInterval(refreshIntervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNightreignPages]);


  const handleGoToRandomPage = () => {
    if (dynamicPages.length === 0) {
      setInfoMessage('No hay páginas para mostrar. Intenta recargar.');
      return;
    }
    const randomIndex = Math.floor(Math.random() * dynamicPages.length);
    const randomPage = dynamicPages[randomIndex];
    const fullUrl = BASE_URL + randomPage;
    
    window.open(fullUrl, '_blank');
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen text-center p-4 bg-[#1a1a2e] text-[#e0e0e0]">
      <h1 className="title-custom text-5xl md:text-6xl font-bold mb-16 sm:mb-24 text-center tracking-[0.1em] sm:tracking-[0.15em]">
        Elige Tu Destino en Nightreign
      </h1>

      <button
        onClick={handleGoToRandomPage}
        disabled={isButtonDisabled}
        className="random-button-custom font-cinzel py-6 px-10 sm:py-8 sm:px-16 text-2xl sm:text-3xl md:text-4xl font-bold rounded-full cursor-pointer relative overflow-hidden 
                   focus:outline-none focus:ring-4 sm:focus:ring-8 focus:ring-yellow-500/75 
                   active:shadow-[0_5px_15px_rgba(0,0,0,0.8),inset_0_2px_8px_rgba(255,255,255,0.05)]"
      >
        {buttonText}
      </button>

      <div 
        className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-gray-300 py-3 px-6 sm:py-4 sm:px-8 rounded-lg border border-gray-600 text-xs sm:text-sm text-center max-w-[90%] sm:max-w-md md:max-w-lg backdrop-blur-sm shadow-xl"
        dangerouslySetInnerHTML={{ __html: infoMessage }}
      />
    </div>
  );
};

export default App;
