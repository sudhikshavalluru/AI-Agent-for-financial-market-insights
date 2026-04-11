
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SentimentType } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAdiJTP379XyVmM1F6R44FOhh1byWp_EpI';
console.log('Gemini API Key loaded:', API_KEY ? 'Yes' : 'No');

const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  async analyzeNews(text: string) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = `Perform Financial NLP analysis on the following news and return JSON with: title, summary, sentiment (BULLISH/BEARISH/NEUTRAL), entities array (each with text and type: COMPANY/TICKER/PERSON/TERM/AMOUNT), and confidence (0-1).

News: ${text}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  },

  async analyzeEarnings(pdfText: string) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = `Extract financial metrics and classify risks from this earnings report. Return JSON with: company, period, metrics (revenue, eps, netIncome, guidance, risks array with category: MARKET/LEGAL/DEBT/OPERATIONAL, description, severity: HIGH/MEDIUM/LOW), toneShift, sentimentScore (0-1), comparison.

Report: ${pdfText}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  },

  async predictStockSentiment(ticker: string, context: string) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = `Provide stock sentiment prediction for ${ticker}. Context: ${context}. Return JSON with: ticker, outlook (BULLISH/BEARISH/NEUTRAL), confidence (0-1), reasoning, sentimentBreakdown (news, earnings, macro as 0-1 values), volatilityForecast (STABLE/MODERATE/HIGH).`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  },

  async askQuestion(query: string, context?: string) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction: "You are a professional Financial NLP Agent. Provide expert analysis with specific citations or references where applicable."
    });
    const prompt = context 
      ? `Using this context: ${context}\n\nQuestion: ${query}\n\nReturn JSON with: answer, reasoning, citations array (each with source and context).`
      : `${query}\n\nReturn JSON with: answer, reasoning, citations array (each with source and context).`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
};
