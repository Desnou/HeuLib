export default function About() {
  return (
    <div
      className="about-container"
      style={{
        fontFamily: '"Roboto", sans-serif',
        lineHeight: '1.8',
        padding: '20px',
        color: '#2c3e50',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#fdfdfd',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '20px',
          borderBottom: '2px solid #ecf0f1',
        }}
      >
        <h1 style={{ fontSize: '2.8rem', color: '#34495e', marginBottom: '10px' }}>
          Acerca de HeuristicLib
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          Un espacio dedicado a descubrir, compartir y aprender sobre heurísticas de usabilidad.
        </p>
      </header>

      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dcdde1',
        }}
      >
        <h2 style={{ fontSize: '2rem', color: '#2980b9', marginBottom: '15px' }}>
          ¿Qué hacemos?
        </h2>
        <p style={{ textAlign: 'justify' }}>
          Nuestra plataforma centraliza conjuntos de heurísticas para dominios específicos, proporcionando a 
          investigadores, profesionales y diseñadores una herramienta valiosa para la evaluación y creación 
          de experiencias de usuario más efectivas. Aquí podrás encontrar recursos para evaluar la usabilidad 
          en campos tan diversos como videojuegos, aplicaciones, interfaces, flataformas web, sistemas, computadoras,
          dispositivos móviles, entre otros (¡Y seguimos creciendo!).
        </p>
      </section>

      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dcdde1',
        }}
      >
        <h2 style={{ fontSize: '2rem', color: '#2980b9', marginBottom: '15px' }}>
          Contribuye con la Comunidad
        </h2>
        <p style={{ textAlign: 'justify' }}>
          Creemos en el poder de la colaboración. Si conoces un conjunto de heurísticas que podría beneficiar a nuestra comunidad, 
          ¡puedes sugerirlo! Todas las sugerencias serán revisadas cuidadosamente por nuestro equipo administrativo para garantizar 
          la calidad y relevancia de la información compartida.
        </p>
      </section>

      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dcdde1',
        }}
      >
        <h3 style={{ fontSize: '1.8rem', color: '#16a085', marginBottom: '15px' }}>
          Pasos para Sugerir un Post
        </h3>
        <ol style={{ paddingLeft: '20px', fontSize: '1rem', listStyleType: 'decimal' }}>
          <li>
            <strong>Título:</strong> Proporciona un título claro para identificar el conjunto.
          </li>
          <li>
            <strong>DOI o Enlace de la Publicación:</strong> Incluye un identificador o enlace que respalde la fuente.
          </li>
          <li>
            <strong>Categorías o Dominios:</strong> Especifica los dominios relacionados (e.g., videojuegos, educación).
          </li>
          <li>
            <strong>Número de Heurísticas:</strong> Indica cuántas heurísticas contiene el conjunto.
          </li>
          <li>
            <strong>Descripción del Conjunto:</strong> Explica brevemente su propósito y aplicación.
          </li>
          <li>
            <strong>Lista de Heurísticas:</strong> Presenta las heurísticas tal como están descritas en la publicación.
          </li>
        </ol>
        <p style={{ marginTop: '15px', textAlign: 'justify' }}>
          Una vez que envíes tu sugerencia, nuestro equipo revisará la información y, tras aprobarla, será publicada 
          para el beneficio de toda la comunidad.
        </p>
      </section>

      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dcdde1',
        }}
      >
        <h2 style={{ fontSize: '2rem', color: '#2980b9', marginBottom: '15px' }}>
          Creciendo Juntos
        </h2>
        <p style={{ textAlign: 'justify' }}>
          Este proyecto es más que una plataforma: es una comunidad en constante crecimiento, donde el conocimiento 
          compartido fomenta mejores prácticas y una usabilidad más efectiva en múltiples contextos. Con cada aporte, 
          ayudamos a construir un recurso esencial para investigadores y profesionales de todo el mundo.
        </p>
      </section>

      <footer
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#ecf0f1',
          borderRadius: '12px',
          color: '#7f8c8d',
        }}
      >
        <p style={{ fontSize: '1rem' }}>
          © {new Date().getFullYear()} Plataforma de Heurísticas | Construyendo comunidad, compartiendo conocimiento.
        </p>
      </footer>
    </div>
  );
};
