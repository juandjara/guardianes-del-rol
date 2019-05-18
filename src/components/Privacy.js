import React from 'react';
import styled from 'styled-components';

const PrivacyStyle = styled.div`
  padding: 10px;
  padding-bottom: 36px;
  > h2 {
    text-align: center;
    font-size: 32px;
    margin: 16px;
  }
  p {
    font-size: 14px;
    line-height: 20px;
  }
  
  h3 {
    font-weight: 500;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
`;

function Privacy() {
  return (
    <PrivacyStyle className="container">
      <h2>Política de Privacidad</h2>
      <p>
        Esta Política de Privacidad describe como recogemos, guardamos o utilizamos la información que recabamos a través de los servicios disponibles en este sitio. Es importante que entienda que información almacenamos ya que el acceso a este sitio y el uso de estos servicios implica la aceptación de nuestra política de privacidad.
      </p>
      <h3>Tu información</h3>
      <p>
        Cuando te registras con tu correo electrónico este queda almacenado en una base de datos gestionada por nosotros. A parte de tu correo electrónico, almacenamos tu nombre y las imágenes que subas a esta plataforma, ya sea como imagen de perfil o dentro de una publicación.
      </p>
      <h3>Cookies</h3>
      <p>
        Para almacenar la información de usuario este sitio usa cookies y tecnologías similares. Las cookies son pequeñas cantidades de información que se almacenan en el navegador utilizado por cada usuario para que el servidor recuerde cierta información que posteriormente pueda utilizar. Esta información permite identificarle a usted como un usuario concreto y permite guardar sus preferencias personales como nombre e imagen de perfil.

        Aquellos usuarios que no deseen recibir cookies o quieran ser informados antes de que se almacenen en su ordenador, pueden configurar su navegador a tal efecto.

        La mayor parte de los navegadores de hoy en día permiten la gestión de las cookies de 3 formas diferentes:

        <ol>
          <li>Las cookies no se aceptan nunca.</li>
          <li>El navegador pregunta al usuario si debe aceptar cada cookie.</li>
          <li>Las cookies se aceptan siempre.</li>
        </ol>

        El navegador también puede incluir la posibilidad de especificar mejor qué cookies tienen que ser aceptadas y cuáles no. En concreto, el usuario puede normalmente aceptar alguna de las siguientes opciones: rechazar las cookies de determinados dominios; rechazar las cookies de terceros; aceptar cookies como no persistentes (se eliminan cuando el navegador se cierra); permitir al servidor crear cookies para un dominio diferente. Además, los navegadores pueden también permitir a los usuarios ver y borrar cookies individualmente.

        Dispone de más información sobre las Cookies en: <a href="https://es.wikipedia.org/wiki/Cookie">https://es.wikipedia.org/wiki/Cookie</a>
      </p>
      <h3>Terceros</h3>
      <p>
        Este sitio funciona con una tecnología de Google llamada Firebase Firestore Database. Esto significa que los datos de los usuarios y las publicaciones se almacenan en una base de datos propiedad de Google y son gestionados por el administrador de la web usando su cuenta de Google. Informamos que este sitio no usa soluciones de seguimiento para medir la actividad de los usuarios tales como Google Analytics.
      </p>
      <h3>Seguridad</h3>
      <p>
        Para proteger tu información personal, tomamos las precauciones necesarias y siempre desplegamos el sitio web en entornos seguros vigilando los fallos de seguridad mas recientes. Asi nos aseguramos de que no haya pérdida de manera inapropiada, mal uso, acceso, divulgación, alteración o destrucción de los datos.
      </p>
      <h3>Cambios a la política de privacidad</h3>
      <p>
        Nos reservamos el derecho a realizar cambios a esta política de privacidad, asi que rogamos que sea revisada frecuentemente. Cambios y aclaraciones entrarán en vigencia inmediatamente después de su publicación en el sitio web.
      </p>
      <h3>Contacto</h3>
      <p>
        Puedes enviarnos un correo a <a href="mailto:guardianesdelrol@gmail.com">guardianesdelrol@gmail.com</a> si tienes cualquier consulta sobre el funcionamiento de lo aquí expuesto. Si quieres registrar una queja, acceder, corregir, enmendar o borrar cualquier información personal que poseamos sobre ti, envianos un correo a esta dirección y responderemos a la mayor brevedad posible.
      </p>
      <h2>RGPD</h2>
      <h3>1 - Responsable</h3>
      <p>
        Conforme  con la normativa vigente de Protección de Datos de le informamos que los datos personales proporcionados serán incorporados a los ficheros de socios y usuarios cuyo titular y responsable del tratamiento es la Asociacion Cultural de ocio alternativo Guardianes Sevilla con domicilio en la calle Valle Verde 4, 41927 Mairena del Aljarafe (Sevilla).
        <br /><br />
        Usted podrá contactar con el Responsable de Protección de Datos en el correo <a href="mailto:guardianesdelrol@gmail.com">guardianesdelrol@gmail.com</a>
      </p>
      <h3>2 - Finalidad del tratamiento</h3>
      <p>
        Los datos personales que nos proporcione serán utilizados unicamente con la finalidad de registro en esta web, para participar en las partidas de rol que se organizan a través de ella. Nunca usaremos las direcciones de correo proporcionadas para enviar propaganda a nuestros usuarios.
      </p>
      <h3>3 - Cesión de Datos a Terceros</h3>
      <p>
        Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal
      </p>
      <h3>4 - Cookies</h3>
      <p>
        Informamos que al acceder al sitio web se podrán utilizar cookies para mantener activa la sesión del usuario y guardar sus preferencias seleccionadas en la aplicación. Para más información, lea el apartado de Cookies en la política de privacidad.
      </p>
      <h3>5 - Derechos</h3>
      <p>
        Usted puede ejercer los derechos sobre los datos suministrados recogidos en el art. 13 del RGPD de acceso, rectificación o supresión, limitación de tratamiento, oposición del tratamiento y derecho al olvido de los datos personales facilitados.
        <br/><br/>
        Puede ejercer estos derechos y revocar los consentimientos sobre el tratamiento dados enviando un correo electrónico a la dirección <a href="mailto:guardianesdelrol@gmail.com">guardianesdelrol@gmail.com</a>, acreditando ser titular de los datos sobre los que quiere ejercer esos derechos.
        <br/><br/>
        Le informamos que usted puede presentar una reclamación ante la Autoridad de Control en materia de Protección de Datos competente si no obtiene satisfacción en el ejercicio de sus derechos.
      </p>
    </PrivacyStyle>
  );
}

export default Privacy;