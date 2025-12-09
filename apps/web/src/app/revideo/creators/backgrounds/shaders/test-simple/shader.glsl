// Simple animated gradient - Shadertoy format
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalize coordinates to 0-1
    vec2 uv = fragCoord / iResolution.xy;

    // Create animated gradient
    vec3 col = 0.5 + 0.5 * cos(iTime * 3.0 + uv.xyx + vec3(0.0, 2.0, 4.0));

    fragColor = vec4(col, 1.0);
}
