// src/components/CaptchaChallenge.tsx
import React from "react";
import { CaptchaElementInternals } from "../hooks/useCaptcha"; // Adjust path as needed

interface CaptchaChallengeProps {
    elementInternals: CaptchaElementInternals;
    messageInfo: { message: string; type: "success" | "error" | "" };
    isCaptchaLoading: boolean;
    isVerifying: boolean;
    isCaptchaVerified: boolean; // To disable slider if verified
    onReloadCaptcha: () => void;
}

export default function CaptchaChallenge({
                                             elementInternals,
                                             messageInfo,
                                             isCaptchaLoading,
                                             isVerifying,
                                             isCaptchaVerified,
                                             onReloadCaptcha,
                                         }: CaptchaChallengeProps) {
    const {
        captchaCanvasRef,
        puzzlePieceImgRef,
        puzzleSliderRef,
        currentPuzzlePieceXForSlider,
        puzzlePieceWidthStyle,
        puzzlePieceHeightStyle,
        handleSliderChange,
        handleSliderRelease,
    } = elementInternals;

    return (
        <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200 mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
                Verifikasi Keamanan
            </h3>
            <p className="text-gray-600 text-sm mb-3">
                Geser puzzle untuk menyelesaikan.
            </p>

            <div className="captcha-container relative text-center w-[400] mx-auto box-border overflow-hidden">
                <canvas
                    ref={captchaCanvasRef}
                    className="border border-gray-200 rounded-md block mx-auto my-2 bg-gray-50"
                ></canvas>
                <img
                    ref={puzzlePieceImgRef}
                    className="puzzle-piece absolute border border-gray-400 shadow-md z-10 hidden"
                    alt="Puzzle Piece"
                    style={{
                        width: puzzlePieceWidthStyle,
                        height: puzzlePieceHeightStyle,
                    }}
                />

                <div className="slider-container w-full mt-2 px-4 box-border">
                    <input
                        type="range"
                        ref={puzzleSliderRef}
                        className="puzzle-slider w-full h-2 bg-gray-300 outline-none opacity-70 rounded-md transition-opacity duration-200 hover:opacity-100"
                        min="0" // Max is set dynamically in useCaptcha hook
                        value={currentPuzzlePieceXForSlider.toString()}
                        onInput={handleSliderChange} // Use onInput for continuous update during drag
                        onMouseUp={handleSliderRelease}
                        onTouchEnd={handleSliderRelease}
                        disabled={isCaptchaLoading || isVerifying || isCaptchaVerified}
                    />
                </div>

                <button
                    type="button"
                    onClick={onReloadCaptcha}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-sm mt-3"
                    disabled={isCaptchaLoading || isVerifying}
                >
                    {isCaptchaLoading ? "Memuat..." : "Muat Ulang CAPTCHA"}
                </button>

                {messageInfo.message && (
                    <div
                        className={`message mt-3 p-2 rounded-md font-medium text-sm ${
                            messageInfo.type === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {messageInfo.message}
                    </div>
                )}
            </div>
            <style>{`
        /* CAPTCHA specific styles (can also be moved to a global CSS or module) */
        .captcha-container {
            position: relative;
            box-sizing: border-box;
            overflow: hidden; /* Important if puzzle piece is absolutely positioned */
        }
        canvas {
            /* Styles are mostly via className, but ensure display block if needed */
        }
        .puzzle-piece {
            position: absolute; /* Ensure this is styled to overlay correctly */
            /* transition: left 0.05s ease-out; // If you want smoother piece movement via style.left */
            /* Styles like border, shadow, z-index from your original code */
        }
        .puzzle-slider {
            -webkit-appearance: none;
            appearance: none;
            /* ... other slider styles from your original code ... */
        }
        .puzzle-slider::-webkit-slider-thumb {
            /* ... styles from your original code ... */
        }
        .puzzle-slider::-moz-range-thumb {
            /* ... styles from your original code ... */
        }
      `}</style>
        </div>
    );
}