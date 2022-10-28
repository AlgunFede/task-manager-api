
# ¡Hola! Bienvenido
Work in Progress :)


**Una breve descripción sobre qué es este proyecto y cuál fue mi objetivo con el:**

Como una forma de poner a prueba los conocimientos que adquirí hasta el momento (y también para retarme a crear una aplicación totalmente de 0), comencé a desarrollar esta RESTful API, con la cuál tuve la posibilidad de plasmar todo lo aprendido hasta el momento.

Para esto, no solo utilicé tecnologías que he aprendido en el camino, sino que me permití probar alternativas a ciertas herramientas, con el objetivo de probar mi capacidad de adaptarme a nuevas tecnologías, resolviendo los errores que se presentaran al momento de implementarlas.




## Herramientas utilizadas

 - Postman: Test API Endpoints
 - [Jest](https://www.npmjs.com/package/jest): Pruebas unitarias
 - [bcrypt](https://www.npmjs.com/package/bcrypt): Hashing para passwords
 - [Cors](https://www.npmjs.com/package/cors): Middleware utilizada para configurar CORS Policy
 - [JSON Web Token](https://www.npmjs.com/package/jsonwebtoken): Utilizado para manejar la autenticación de usuarios


## Tech Stack

**Server:** Node, Express, MongoDB


## API Endpoints:

#### Register User

```http
  POST /signup
```
Contenido en el body necesario para la solicitud:
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**|
| `email` | `string` | **Required**|
| `password` | `string` | **Required**|

#### Log In User

```http
  GET /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**|
| `password`      | `string` | **Required**|



## Feedback

Si tenés cualquier tipo de feedback, no dudes en escribirme, realmente me ayudaría a mejorar mis capacidades técnicas. 
