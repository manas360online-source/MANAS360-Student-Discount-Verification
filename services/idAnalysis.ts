
import { GoogleGenAI, Type } from "@google/genai";
// Removed missing StudentQRData import as it was unused
import { VerificationResult } from "../types";
import { MOCK_PARTNERSHIPS, BASE_PRICE } from "../constants";

export const analyzeIdImage = async (base64Image: string): Promise<VerificationResult> => {
  // Initializing GoogleGenAI inside the function as per guidelines for reliable API key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: `Analyze this student ID card image. Extract the institution name, student name, and any expiry or graduation date. 
              Match the institution name against our partners: ${MOCK_PARTNERSHIPS.map(p => p.institution_name).join(", ")}.
              If a match is found, provide the details in the specified JSON format.`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            institution_name: { type: Type.STRING },
            student_name: { type: Type.STRING },
            expiry_date: { type: Type.STRING, description: "YYYY-MM-DD format" },
            is_valid_student_id: { type: Type.BOOLEAN }
          },
          required: ["institution_name", "is_valid_student_id"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    if (!data.is_valid_student_id) {
      return {
        success: true,
        has_partnership: false,
        message: "We couldn't verify this as a valid student ID from a partner institution.",
        price: BASE_PRICE
      };
    }

    const partnership = MOCK_PARTNERSHIPS.find(p => 
      data.institution_name.toLowerCase().includes(p.institution_name.toLowerCase()) ||
      p.institution_name.toLowerCase().includes(data.institution_name.toLowerCase())
    );

    if (!partnership) {
      return {
        success: true,
        has_partnership: false,
        message: `Recognized: ${data.institution_name}. Unfortunately, this institution is not yet a MANAS360 partner.`,
        price: BASE_PRICE
      };
    }

    const discountAmount = Math.round(BASE_PRICE * (partnership.discount_percentage / 100));
    const finalPrice = BASE_PRICE - discountAmount;

    return {
      success: true,
      has_partnership: true,
      // Fixed: institution_name property now exists in VerificationResult interface
      institution_name: partnership.institution_name,
      entity_name: partnership.institution_name,
      discount_percentage: partnership.discount_percentage,
      discount_amount: discountAmount,
      original_price: BASE_PRICE,
      final_price: finalPrice,
      discount_valid_until: data.expiry_date || partnership.contract_end_date,
      message: `AI Verification Successful! ${partnership.institution_name} partnership detected.`
    };

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      success: false,
      has_partnership: false,
      message: "AI verification service is temporarily unavailable. Please try the QR scan method."
    };
  }
};