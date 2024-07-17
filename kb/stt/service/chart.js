import { Chart } from "/kb/stt/common/util/chart-es.js";
import { EvaluateSpeechSubject } from "/kb/stt/common/common.js";
export const setEvaluateSpeechChart = (evaluateSpeech, canvasElement) => {
    if (canvasElement === null) {
        throw new Error("Canvas not exists!");
    }
    const ctx = canvasElement.getContext("2d");
    if (ctx === null) {
        throw new Error("CanvasRenderingContext2D init error!");
    }
    drawEvaluateSpeechChart(evaluateSpeech, ctx);
};
export const setIntonationChart = (intonations, canvasElement) => {
    if (canvasElement === null) {
        throw new Error("Canvas not exists!");
    }
    const ctx = canvasElement.getContext("2d");
    if (ctx === null) {
        throw new Error("CanvasRenderingContext2D init error!");
    }
    drawIntonationChart(intonations, ctx);
};
export const drawEvaluateSpeechChart = (evaluateSpeech, ctx) => {
    const chartProficiencyScores = evaluateSpeech.sentenceLevel.proficiencyScore.filter((scoreMap) => scoreMap.name !== "acoustic");
    const chartData = {
        labels: chartProficiencyScores.map((scoreMap) => getEvaluateScoreSubjectName(scoreMap.name)),
        datasets: [{
                data: chartProficiencyScores.map((scoreMap) => scoreMap.score),
            }],
    };
    new Chart(ctx, {
        type: "radar",
        data: chartData,
        options: {
            scales: {
                r: {
                    pointLabels: {
                        font: {
                            size: 20,
                        },
                    },
                    min: 0,
                    max: chartProficiencyScores[0].max,
                },
            },
            responsive: false,
            plugins: {
                title: {
                    display: false,
                },
                legend: {
                    display: false,
                },
            },
        },
    });
};
export const drawIntonationChart = (intonations, ctx) => {
    const chartData = {
        labels: intonations[0].data.map((value, index) => index),
        datasets: intonations.map((intonation) => ({
            label: intonation.title,
            data: intonation.data.map((value) => value),
            tension: 0.2,
        })),
    };
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            // animations: {
            //   radius: {
            //     duration: 400,
            //     easing: 'linear',
            //     loop: (ctx: CanvasRenderingContext2D) => ctx.active
            //   }
            // },
            responsive: false,
            elements: {
                point: {
                    radius: 0,
                },
            },
            interaction: {
                mode: "nearest",
                intersect: false,
            },
            plugins: {
                tooltip: {
                    enabled: false,
                },
            }
        },
    });
};
const getEvaluateScoreSubjectName = (name) => {
    if (name === "acoustic") {
        return "";
    }
    return EvaluateSpeechSubject[name];
};
