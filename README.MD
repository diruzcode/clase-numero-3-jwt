
Un JWT consta de tres partes principales, separadas por puntos:

1. Header (Encabezado)
2. Payload (Carga útil)
3. Signature (Firma)

Veamos cada parte y el flujo completo:

### Estructura del JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c3VhcmlvMSIsImlhdCI6MTYzNjI0NTc3OH0.9vYrqkdm3bqUYOMvGj8jC1xH2qmqFooX5Z8O_FX_Elm
```

### 1. Header
```json
{
  "alg": "HS256",  // Algoritmo de firma
  "typ": "JWT"     // Tipo de token
}
```

### 2. Payload (donde va la información del usuario)
```json
{
  "id": 1,
  "username": "usuario1",
  "role": "admin",
  "iat": 1636245778  // Fecha de emisión
}
```

### 3. Signature (firma)
Se crea usando:
- El header codificado
- El payload codificado
- La clave secreta
- El algoritmo especificado

### Flujo de funcionamiento:

1. **Proceso de Login**:
   ```javascript
   // Cuando el usuario hace login exitosamente
   const token = jwt.sign(
     { id: user.id, username: user.username }, // payload
     JWT_SECRET,                               // clave secreta
     { expiresIn: '1h' }                      // opciones
   );
   ```

2. **Almacenamiento**:
   - El cliente (navegador/app) guarda el token (típicamente en localStorage o cookies)

3. **Uso en peticiones**:
   ```javascript
   // El cliente envía el token en cada petición
   headers: {
     'Authorization': 'Bearer eyJhbGciOiJIUzI1...'
   }
   ```

4. **Verificación**:
   ```javascript
   // El servidor verifica el token
   const decoded = jwt.verify(token, JWT_SECRET);
   // Si es válido, decoded contiene el payload
   ```

### Ventajas de JWT:

1. **Stateless**: El servidor no necesita mantener una sesión
2. **Escalable**: Funciona bien en sistemas distribuidos
3. **Seguro**: La información está firmada y no puede ser alterada
4. **Portable**: Puede usarse en diferentes tipos de aplicaciones

### Consideraciones de Seguridad:

1. **No guardes información sensible** en el payload
2. **Usa HTTPS** siempre para transmitir JWTs
3. **Define tiempos de expiración** adecuados
4. **Protege tu clave secreta**
5. **Valida todos los campos** necesarios

### Ejemplo de uso completo:

```javascript
// 1. Usuario hace login
app.post('/login', (req, res) => {
    // Verificar credenciales
    if (credencialesValidas) {
        // Crear token
        const token = jwt.sign(
            { userId: user.id }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.json({ token });
    }
});

// 2. Usuario hace una petición protegida
app.get('/ruta-protegida', authenticateToken, (req, res) => {
    // req.user contiene la información del payload
    console.log(req.user.userId);
    // ... lógica de la ruta
});
```

¿Hay alguna parte específica sobre la que te gustaría profundizar?