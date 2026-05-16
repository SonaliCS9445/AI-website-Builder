 export const extractJson = (text) => {
    if(!text) return null;

    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    const firstBrace = cleaned.indexOf('{');
    const closeBrace = cleaned.lastIndexOf('}');

    if(firstBrace === -1 || closeBrace === -1 || firstBrace > closeBrace) {
        return null;
    }

    const jsonStr = cleaned.substring(firstBrace, closeBrace + 1);
    try {
        return JSON.parse(jsonStr);
    } catch {
        return null;
    }
}