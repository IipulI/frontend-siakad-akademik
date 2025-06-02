// src/hooks/useCaptcha.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { Api } from '../api/Index'; // Adjust path if your Api object is elsewhere

// Define the interface for the data received from the backend CAPTCHA API
interface CaptchaResponseData {
    holedImageBase64: string;
    puzzlePieceBase64: string;
    puzzlePieceWidth: number;
    puzzlePieceHeight: number;
    initialPuzzlePieceX: number;
    puzzlePieceY: number;
    imageWidth: number;
    imageHeight: number;
    correctPuzzlePieceX: number; // Only used by backend for verification
}

export interface CaptchaElementInternals {
    captchaCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    puzzlePieceImgRef: React.RefObject<HTMLImageElement |null>;
    puzzleSliderRef: React.RefObject<HTMLInputElement | null>;
    currentPuzzlePieceXForSlider: number; // To reflect the slider's logical value
    puzzlePieceWidthStyle: number;       // For styling the img tag
    puzzlePieceHeightStyle: number;      // For styling the img tag
    handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSliderRelease: () => void;
}

export interface UseCaptchaReturn {
    isCaptchaVerified: boolean;
    isCaptchaLoading: boolean;
    isVerifying: boolean;
    elementInternals: CaptchaElementInternals;
    messageInfo: { message: string; type: "success" | "error" | "" };
    triggerReload: () => Promise<void>;
    triggerResetAndReload: () => Promise<void>;
}

export function useCaptcha(): UseCaptchaReturn {
    const captchaCanvasRef = useRef<HTMLCanvasElement>(null);
    const puzzlePieceImgRef = useRef<HTMLImageElement>(null);
    const puzzleSliderRef = useRef<HTMLInputElement>(null);

    const [currentPuzzlePieceX, setCurrentPuzzlePieceX] = useState<number>(0); // Logical X for verification
    const [puzzlePieceYOffsetStyle, setPuzzlePieceYOffsetStyle] = useState<number>(0); // For puzzle piece style.top
    const [puzzlePieceWidth, setPuzzlePieceWidth] = useState<number>(0);
    const [puzzlePieceHeight, setPuzzlePieceHeight] = useState<number>(0);

    const [captchaMessage, setCaptchaMessage] = useState<string>("");
    const [captchaMessageType, setCaptchaMessageType] = useState<"success" | "error" | "">("");
    const [isCaptchaLoading, setIsCaptchaLoading] = useState<boolean>(true);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);

    const displayCaptchaMessage = useCallback(
        (msg: string, type: "success" | "error" | "") => {
            setCaptchaMessage(msg);
            setCaptchaMessageType(type);
        },
        []
    );

    const loadCaptchaInternal = useCallback(async () => {
        displayCaptchaMessage("", "");
        setIsCaptchaLoading(true);
        setIsCaptchaVerified(false);
        if (puzzlePieceImgRef.current) {
            puzzlePieceImgRef.current.classList.add("hidden");
        }

        try {
            const response = await Api.get("/captcha/generate", {
                withCredentials: true,
            });

            const data: CaptchaResponseData = response.data;

            setPuzzlePieceWidth(data.puzzlePieceWidth);
            setPuzzlePieceHeight(data.puzzlePieceHeight);
            setCurrentPuzzlePieceX(data.initialPuzzlePieceX);

            if (puzzleSliderRef.current) {
                const sliderMax = data.imageWidth - data.puzzlePieceWidth;
                puzzleSliderRef.current.max = sliderMax.toString();
                puzzleSliderRef.current.value = data.initialPuzzlePieceX.toString();
            }

            const holedImageElement = new Image();
            const puzzlePieceElement = new Image();

            const loadImagePromises = [
                new Promise<void>((resolve, reject) => {
                    holedImageElement.onload = () => resolve();
                    holedImageElement.onerror = (err) => { console.error("Holed image load error:", err); reject(err); };
                }),
                new Promise<void>((resolve, reject) => {
                    puzzlePieceElement.onload = () => resolve();
                    puzzlePieceElement.onerror = (err) => { console.error("Puzzle piece image load error:", err); reject(err); };
                })
            ];

            holedImageElement.src = `data:image/png;base64,${data.holedImageBase64}`;
            puzzlePieceElement.src = `data:image/png;base64,${data.puzzlePieceBase64}`;

            await Promise.all(loadImagePromises);

            const canvasElement = captchaCanvasRef.current;
            if (canvasElement && puzzlePieceImgRef.current) {
                const ctx = canvasElement.getContext("2d");
                if (ctx) {
                    canvasElement.width = data.imageWidth;
                    canvasElement.height = data.imageHeight;
                    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    ctx.drawImage(holedImageElement, 0, 0);

                    // Calculate visual positions for the puzzle piece image
                    // style.left/top are relative to the puzzle piece's offsetParent (e.g., .captcha-container)
                    // canvasElement.offsetLeft/Top are relative to *its* offsetParent.
                    // If they share the same offsetParent, these are the correct offsets.
                    const initialStyleLeft = data.initialPuzzlePieceX + canvasElement.offsetLeft;
                    const initialStyleTop = data.puzzlePieceY + canvasElement.offsetTop;

                    puzzlePieceImgRef.current.src = puzzlePieceElement.src;
                    puzzlePieceImgRef.current.style.left = `${initialStyleLeft}px`;
                    puzzlePieceImgRef.current.style.top = `${initialStyleTop}px`;
                    setPuzzlePieceYOffsetStyle(initialStyleTop); // Store for potential use during drag if top changes

                    puzzlePieceImgRef.current.classList.remove("hidden");
                }
            }
        } catch (error) {
            console.error("Failed to load CAPTCHA:", error);
            displayCaptchaMessage("Gagal memuat CAPTCHA. Silakan coba lagi.", "error");
        } finally {
            setIsCaptchaLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayCaptchaMessage]); // Dependencies should be stable or carefully managed

    useEffect(() => {
        loadCaptchaInternal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Initial load

    const verifyCaptchaInternal = useCallback(async () => {
        if (isVerifying) return;
        setIsVerifying(true);
        displayCaptchaMessage("", ""); // Clear message on new attempt

        try {
            const response = await Api.post(
                "/captcha/verify",
                { userPuzzlePieceX: Math.round(currentPuzzlePieceX) },
                { withCredentials: true }
            );

            const isCorrect: boolean = response.data;

            if (isCorrect) {
                displayCaptchaMessage("CAPTCHA berhasil diverifikasi!", "success");
                setIsCaptchaVerified(true);
            } else {
                displayCaptchaMessage("Posisi puzzle salah. Silakan coba lagi.", "error");
                setIsCaptchaVerified(false);
                // Reload a new CAPTCHA after a short delay
                setTimeout(loadCaptchaInternal, 1500);
            }
        } catch (error) {
            console.error("Failed to verify CAPTCHA:", error);
            displayCaptchaMessage("Verifikasi gagal. Silakan coba lagi.", "error");
            setIsCaptchaVerified(false);
            setTimeout(loadCaptchaInternal, 1500); // Also reload on error
        } finally {
            setIsVerifying(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVerifying, currentPuzzlePieceX, displayCaptchaMessage, loadCaptchaInternal]);

    const handleSliderChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newX: number = parseInt(e.target.value, 10);
            setCurrentPuzzlePieceX(newX); // Update logical X for verification

            if (puzzlePieceImgRef.current && captchaCanvasRef.current) {
                // newX is the slider's value, relative to the start of the droppable area on the image
                // Add canvas's own offsetLeft within its parent to get the correct style.left
                puzzlePieceImgRef.current.style.left = `${newX + captchaCanvasRef.current.offsetLeft}px`;
                // Keep the top position fixed based on initial load
                puzzlePieceImgRef.current.style.top = `${puzzlePieceYOffsetStyle}px`;
            }
        },
        [puzzlePieceYOffsetStyle] // puzzlePieceYOffsetStyle is stable after load
    );

    const handleSliderRelease = useCallback(() => {
        if (!isCaptchaVerified) { // Only verify if not already solved
            verifyCaptchaInternal();
        }
    }, [verifyCaptchaInternal, isCaptchaVerified]);

    const triggerReload = useCallback(async () => {
        await loadCaptchaInternal();
    }, [loadCaptchaInternal]);

    const triggerResetAndReload = useCallback(async () => {
        setIsCaptchaVerified(false); // Explicitly reset verification
        await loadCaptchaInternal();
    }, [loadCaptchaInternal /* setIsCaptchaVerified is stable */]);

    return {
        isCaptchaVerified,
        isCaptchaLoading,
        isVerifying,
        elementInternals: {
            captchaCanvasRef,
            puzzlePieceImgRef,
            puzzleSliderRef,
            currentPuzzlePieceXForSlider: currentPuzzlePieceX,
            puzzlePieceWidthStyle: puzzlePieceWidth,
            puzzlePieceHeightStyle: puzzlePieceHeight,
            handleSliderChange,
            handleSliderRelease,
        },
        messageInfo: {
            message: captchaMessage,
            type: captchaMessageType,
        },
        triggerReload,
        triggerResetAndReload,
    };
}
