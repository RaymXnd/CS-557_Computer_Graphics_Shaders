#version 330 compatibility

in vec2 vST;
in vec3 vMCposition;
in float vLightIntensity;

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uAlpha;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

const vec3 Purple = vec3(0.2, 0.2, 0.2);
const vec3 Darkgray = vec3(0.9,0.7,0.9);

uniform sampler3D Noise3;

void
main() 
{
	vec4 nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
	// give the noise a range of [-1.,+1.]:
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	n *= uNoiseAmp;

	//draw dots
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );

	// determine the color based on the noise-modified (s,t):
	float sc = float(numins) * uAd  +  Ar;
	float ds = vST.s - sc;                   // wrt ellipse center
	float tc = float(numint) * uBd  +  Br;
	float dt = vST.t - tc;                   // wrt ellipse center
	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

	//scale ds and dt, then divide both by Ar and Br
	ds *= scale; // scale by noise factor
	ds /= Ar; // ellipse equation
	dt *= scale; // scale by noise factor
	dt /= Br; // ellipse equation

	//compute d using the new ds and dt
	float d = ds*ds + dt*dt;

	//d = pow(((vST.s - sc)/Ar), 2) + pow(((vST.t - tc)/Br), 2);
	float t = smoothstep( 1. - uTol, 1. + uTol, d );
	//vec3 mixColor = mix(Purple, Darkgray, t);
	//vec3 rgb = vLightIntensity * mixColor;
	//gl_FragColor = vec4(rgb, 1.);

	gl_FragColor = mix(vec4(vLightIntensity * Purple, 1), vec4(vLightIntensity * Darkgray, uAlpha), t);
    
    //if (uAlpha == 0.)
    //{
    //	discard;
    //}
}