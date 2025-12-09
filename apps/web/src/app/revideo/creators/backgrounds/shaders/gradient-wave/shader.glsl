// Animated gradient wave shader
// Pure Shadertoy format - will be wrapped automatically

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalize coordinates
    vec2 uv = fragCoord / iResolution.xy;

    // Create animated gradient
    vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0.0, 2.0, 4.0));

    // Output color
    fragColor = vec4(col, 1.0);
}
