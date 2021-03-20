#version 330 compatibility

uniform float Timer;
uniform float uA = 5.;
uniform float uP = 0.25;
uniform float uTol = 0.06;
//in
in vec2  vST;
in vec3 vColor;
in float vX, vY;
in float vLightIntensity;

const vec3 WHITE = vec3( 1., 1., 1. );
const vec3 GRAY = vec3( 0.41, 0.41, 0.41 );
void
main( )
{
	//rgb animating color
	vec3 color_rbg = vec3( vST.s, vST.t, abs(sin(3.14 * Timer)));

	float r = sqrt( vX*vX + vY*vY );
	float rfrac = fract( uA*r );
	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, rfrac ) - smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, rfrac ); // “smoothpulse”
	vec3 rgb = vLightIntensity * mix( WHITE, GRAY, t );

	gl_FragColor = vec4( rgb + color_rbg, 1. );
}