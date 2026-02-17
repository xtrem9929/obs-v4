export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { history } = req.body;

    const informacionDeLaPagina = `
        Nombre: Mant-enimiento.
        Servicios: Arreglo de celulares, laptops y tablets. Servicios técnicos generales.
        Ubicación: Ica, Perú.
        Contacto: juanito@mameluco.com
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `Eres el asistente de Mant-enimiento. 
                        REGLA DE ORO: Responde de forma EXTREMADAMENTE BREVE y DIRECTA. 
                        Máximo 2 frases por respuesta. 
                        Solo responde sobre: ${informacionDeLaPagina}. 
                        Si no sabes la respuesta o es fuera de tema, di: "Solo puedo ayudarte con temas técnicos de la web."` 
                    },
                    ...history
                ],
                temperature: 0.1,
                max_tokens: 100 // Limitamos la cantidad de palabras que puede generar
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: "Error de servidor." });
    }
}