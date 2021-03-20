#version 330 compatibility

in vec2 vST;

uniform float uAd;
uniform float uBd;
uniform float uTol;

const vec3 BgColor = vec3(0.2, 0.2, 0.2);
const vec3 DotColor = vec3(0.9,0.7,0.9);

in float vLightIntensity;

void
main() 
{
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );
	float sc = numins * uAd + Ar;
	float tc = numint * uBd + Br;
	float results_of_ellipse_equation = pow(((vST.s - sc)/Ar), 2) + pow(((vST.t - tc)/Br), 2);
	float t = smoothstep( 1. - uTol, 1. + uTol, results_of_ellipse_equation );
	vec3 mixColor = mix(DotColor, BgColor, t);
	vec3 rgb = vLightIntensity * mixColor;
	gl_FragColor = vec4(rgb, 1.);
}