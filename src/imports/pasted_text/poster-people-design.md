Vamos a trabajar en un sitio web llamado Poster People.

Contexto de negocio:
Empresa que se dedica a la imprenta de artículos promocionales. Vamos a trabajar en un diseño vanguardista en el que resalten los servicios. 
PALETA PRIMARIA
HEX: 009681, FA4616, 307FE2, FF3EB5, 154734
PALETA SECUNDARIA: 
HEX: 01426A, 13322B, 53565A, 888B8D, B1B3B3, F1C4000
TIPOGRFIA: Helvética Neue

Ejemplo de estructura:

Página Inicio:
	Secciónes
•	Slider con los primeros 3 servicios, mientras el slider va cambiando el texto de en medio va fijo Titulo: “Tu marca, nuestra pasión creativa” y justo debajo como con un salto de línea un buscador de servicios por palabra clave el cual tendrá como placeholder ¿Qué tienes en mente?, Cuando el usuario empiece a escribir se desplegarán los primeros resultados, (Al dar clic en los resultados los enviará a la sección(ruta) del servicio ej: /posterpeople.com/servicios/nombre-de-servicio el cual será una página adicional el cual se trabajará mas adelante). Debajo de este buscador habrán 2 call to action. Cotiza ahora y Ver servicios. Cotiza ahora te desplazará a la sección de contacto desde el mismo inicio y ver servicios a la sección /servicios.
•	¿Quiénes somos? Una sección pequeña el cual tendrá lo siguiente: “En Poster People somos especialistas en soluciones de merchandising e impresión que ayudan a las marcas a destacar y conectar con sus clientes. Combinamos creatividad, innovación y calidad para desarrollar productos personalizados que impulsan la identidad de cada negocio. Nuestro compromiso con la excelencia, la responsabilidad y la atención personalizada nos convierte en un aliado estratégico para empresas que buscan proyectar su marca con soluciones visuales de alto impacto.” De igual manera un call to action que diga “contactanos” y que lleve al formulario de contacto.
•	Preguntas frecuentes:
{[
            {
              question: "¿Cuál es el tiempo de entrega?",
              answer: "El tiempo de entrega varía según el producto y la cantidad. En general, manejamos entregas entre 5 y 15 días hábiles. Para pedidos urgentes, ofrecemos servicio express."
            },
            {
              question: "¿Tienen un pedido mínimo?",
              answer: "Sí, manejamos diferentes cantidades mínimas dependiendo del producto. Contáctanos para conocer los detalles específicos de tu proyecto."
            },
            {
              question: "¿Puedo ver una muestra antes de producir?",
              answer: "¡Por supuesto! Ofrecemos mockups digitales y, en algunos casos, muestras físicas antes de la producción final."
            },
            {
              question: "¿Qué métodos de personalización ofrecen?",
              answer: "Ofrecemos serigrafía, sublimación, bordado, grabado láser, impresión digital y más. Cada método depende del producto y tus necesidades específicas."
            },
            {
              question: "¿Hacen envíos a toda la república?",
              answer: "Sí, realizamos envíos a nivel nacional. Trabajamos con las mejores paqueterías para garantizar entregas seguras y puntuales."
            }
          ].map((faq, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
              <details className="bg-white rounded-xl shadow-lg p-6 group hover:shadow-xl transition-all">
                <summary className="cursor-pointer text-lg text-[#13322b] font-semibold flex justify-between items-center">
                  <span>{faq.question}</span>
                  <ChevronRight className="transform group-open:rotate-90 transition-transform text-[#f0c545]" size={24} />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            </ScrollAnimationWrapper>
          ))}
•	Formulario de contacto: formulario lado izuiqerdo y a la derecha redes sociales y coreo electrónico.
Página servicios:
•	Sección con un resumen de los servicios, imágenes o iconos de los servicios relacionados. 
Detalle de servicios:
•	Landing page con toda la información del json de prueba que muestro mas adelante.


Servicios principales que provee:
Impresión Mediano Formato medida máxima 2.44x1.22 mts
•	Impresión en vinil adhesivo, vinil estático, microperforado, etc
•	floor graphics, señalética
•	Impresión en lona
•	Impresión en materiales rígidos Acrilico, vidrio, aluminio, metal (cama plana UV) y semirigidos coroplast, foambord, pvc, estireno
•	Producción para interiores y exteriores
•	Laminados mates y brillantes
Corte de Vinil
•	Corte de vinil adhesivo
•	Letras, logotipos y gráficos personalizados con y sin iluminación
•	Aplicaciones decorativas y comerciales
Impresión en Material Rígido (UV)
•	Impresión directa sobre acrílico, PVC, MDF, vidrio, aluminio y otros materiales
•	Señalética
•	Displays: stand, flag banner, muros, back
•	Placas y piezas personalizadas
Grabado y Corte Láser
•	Grabado láser CO₂
•	Grabado láser de fibra (metales)
•	Corte y grabado en acrílico
•	Placas y señalética personalizada
•	Productos promocionales
Sublimación y Personalizados
•	Tazas
•	Playeras
•	Gorras
•	Placas metálicas
•	Cuadernos y libretas
•	Artículos promocionales personalizados
DTF Textil
•	Personalización de playeras
•	Uniformes
•	Prendas promocionales
•	Producción para marcas
•	Aplicación de DTF en diferentes tipos de tela

Diseño
•	Diseño gráfico básico para impresión
•	Adaptación de archivos
•	Desarrollo de identidad visual
•	Preparación de artes finales para producción
Servicios adicionales:
Instalación
•	Instalación de vinil
•	Montaje de señalética
Entregas y Envíos
•	Entregas locales
•	Envíos nacionales
•	Embalaje seguro según el tipo de material

Instrucciones técnicas.
Como será una página web es indispensable navegar en el sitio y que cambien las urls del sitio es decir usar react-route para poder lograrlo. 
Para la sección de servicios, al ser muchos y básicamente todos tienen la misma estructura vamos a crear un arreglo de servicios el cual react interpretará y pintará para ello podemos crear un solo componente llamado /servicios-detalle y pasarle por medio de un json el servicio al cual se desea acceder. Ejemplo:

const servicios: Servicio[] = [
  {
    orden: 1,
  path: “impresión-de-lonas”
    tituloServicio: "Impresión de lonas",
    descripcion: "Impresión de alta calidad en lonas publicitarias para exteriores e interiores. Resistentes al agua y rayos UV.",
    esEstrella: true, 
   imagenesGaleria: [ imagen1, imagen2,]
  },
  {
    orden: 2,
  path: “impresión-de-tazas”

    tituloServicio: "Impresión de tazas",
    descripcion: "Tazas personalizadas con tu diseño. Perfectas para regalos corporativos y promocionales.",
    esEstrella: true,
   imagenesGaleria: [ imagen1, imagen2,]
  },
];

De esta manera este mismo arreglo me servirá para el buscador de servicios.
