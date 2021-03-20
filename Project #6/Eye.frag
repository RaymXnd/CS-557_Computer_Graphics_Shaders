#version 330 compatibility

//in
in float vX, vY;
in vec3 vColor;
in float vLightIntensity;

uniform float uA = 5.;
uniform float uP = 0.25;
uniform float uTol = 0.1;

const vec3 WHITE = vec3( 1., 1., 1. );
const vec3 BLACK = vec3( 0., 0., 0. );
void
main( )
{
	float r = sqrt( vX*vX + vY*vY );
	float rfrac = fract( uA*r );
	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, rfrac ) - smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, rfrac ); // “smoothpulse”
	vec3 rgb = vLightIntensity * mix( BLACK, WHITE, t );
	gl_FragColor = vec4( rgb, 1. );
}