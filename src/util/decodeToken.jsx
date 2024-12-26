export default function decodeToken(token){
    try {
        const base64Payload = token.split('.')[1]; // JWT의 payload 부분
        const payload = atob(base64Payload); // Base64 디코딩
        return JSON.parse(payload); // JSON 파싱
    } catch (error) {
        console.error('토큰 해석 실패:', error);
        return null;
    }
}