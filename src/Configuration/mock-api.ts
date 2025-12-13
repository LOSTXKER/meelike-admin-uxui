/**
 * Mock API Configuration
 * 
 * ใช้ environment variable VITE_USE_MOCK_DATA=true เพื่อเปิด mock mode
 * เมื่อเปิด mock mode จะใช้ข้อมูลจากไฟล์ local แทน API จริง
 */

// Check if mock mode is enabled
export const isMockMode = (): boolean => {
    return import.meta.env.VITE_USE_MOCK_DATA === 'true';
};

// Simulate API delay (for realistic UX)
export const mockDelay = (ms: number = 300): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock response wrapper
export const createMockResponse = <T>(data: T, totalItems?: number) => {
    return {
        success: true,
        data: totalItems !== undefined ? { data, totalItems } : data
    };
};

// Log mock usage (for debugging)
export const logMockUsage = (endpoint: string) => {
    if (import.meta.env.DEV) {
        console.log(`🔸 [MOCK] ${endpoint}`);
    }
};
