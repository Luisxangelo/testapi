# Blog Api

## Descripcion del proyecto

Este proyecto es una API de un blog que permitira a los usuario, registrarse, iniciar sesion, subir post,
comentar post, ver post, se podra subir imagenes, ir al perfil de un usuario. La aplicacion esta construida utilizando Node Js, express y utiliza como base de datos PostgresSQL, para almacenar la informacion

## Funcionalidades Principales

1. Crear post
2. Subir imagenes
3. Registrar usuarios
4. Loguearse con usuario
5. Utilizar web socket al momento de crear un post, se emita el post a todos los clientes
6. Comentar post
7. Eliminar post
8. Actualizar post

## Tecnologias utilizadas

1. Express:Un framework minimalista de Node.js que facilita la creación de aplicaciones web y APIs.
2. Express-rate-limit: Middleware de Express que limita la cantidad de solicitudes que un cliente puede hacer en un período de tiempo especificado.
3. Firebase: Una plataforma de desarrollo de aplicaciones móviles y web que proporciona herramientas para crear, mejorar y hacer crecer aplicaciones.
4. PostgreSQL: Un sistema de gestión de bases de datos relacionales de código abierto.
5. Sequelize: Un ORM (Object-Relational Mapping) para bases de datos SQL que simplifica la interacción con la base de datos y proporciona una capa de abstracción sobre SQL.
6. Jsonwebtokens: JWT (JSON Web Token) es un estándar qué está dentro del documento RFC 7519.
7. socket.io: Libreria que nos ayuda en la comunicacion en tiempo real

## Requisito previos para utilizar el proyecto

1. Tener node instalado en el equipo
2. Tener postgresSQL instalado
3. Tener creada una base de datos en postgresSQL

## Como ejecutar el proyecto

1. Clonar el repositorio
2. Ejecutar npm install

```
    npm install

```

3. Crearse la base de datos local con postgresSQL
4. Crearse una app en firebase e inicializar firestore en ella
5. Clonar el .env.template y renombrar a .env
6. Llenar las variables de entorno
7. Levantar el modo de desarrollo utilizando el comando:

```
    npm run star:dev

```
