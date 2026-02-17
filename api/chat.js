export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { history } = req.body;

    const baseConocimiento = `
    INSTITUCIÓN: Facultad de Obstetricia UNICA, creada el 15/01/2013 (Res. 046-R-UNICA-2013).
    AUTORIDADES: Decana: Dra. Rosa Ruiz Reyes. Directora Escuela: Mg. Luz Gutiérrez. Investigación: Mg. Yuly Blanco. Depto Académico: Dra. Bertha Curi.
    ACADÉMICO: 5 años (10 semestres). Nota mínima 11. Evaluación: Continua (40%), Parcial (30%), Final (30%).
    PRÁCTICAS: Inician en V ciclo (Básica) hasta X ciclo (Internado). Sedes: Hosp. Regional Ica, Centros MINSA. Requisito 90% asistencia.
    TESIS: Desde el 80% de créditos. Temas: Salud sexual, preeclampsia, parto.
    CONTACTO: obstetricia@unica.edu.pe. Ubicación: Ciudad Universitaria, Ica.
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
                        content: `Eres el Asistente de la Facultad de Obstetricia UNICA. 
                                Olvida todo lo anterior sobre laptops o reparaciones. 
                                Solo respondes sobre: ${baseConocimiento}. 
                                Si no sabes algo, di: Solo manejo información de la Facultad de Obstetricia.` 
                    },
                    ...history
                ],
                temperature: 0.1,
                max_tokens: 120
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: "Error al conectar con la base de datos académica." });
    }
}