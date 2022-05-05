const debugObject = {
    count: 200000,
    size: 15,
    branches: 4,
    radius: 3,
    randomness: .65,
    randomnessPower: 3.2,
    innerColor: '#a340b7',
    outerColor: '#565fc0',
    rotationSpeed: .3
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gui = new dat.GUI()

const canvas = document.querySelector('canvas')

const scene = new THREE.Scene()

let geometry = null
let material = null
let mesh = null

const generateGalaxy = () => {

    if( geometry ) {
        geometry.dispose()
        material.dispose()
        scene.remove(mesh)
    }

    geometry = new THREE.BufferGeometry()
    
    // ====================
    // Set positions
    // ====================
    const positions     = new Float32Array( debugObject.count * 3 )
    const scales        = new Float32Array( debugObject.count )
    const colors        = new Float32Array( debugObject.count * 3 )
    const randomness    = new Float32Array( debugObject.count * 3 )

    const innerColor = new THREE.Color(debugObject.innerColor)
    const outerColor = new THREE.Color(debugObject.outerColor)
    
    for (let i = 0; i < debugObject.count; i++) {
        const randomRadius = Math.random() * debugObject.radius
        const i3 = i * 3;
    
        const angle = (i % debugObject.branches) / debugObject.branches * Math.PI * 2
    
    
        positions[i3]       = Math.cos(angle) * randomRadius * debugObject.radius
        positions[i3 + 1]   = 0
        positions[i3 + 2]   = Math.sin(angle) * randomRadius * debugObject.radius

        scales[i] = Math.random()

        const pointColor = innerColor.clone()
        pointColor.lerp(outerColor, randomRadius / debugObject.radius)

        colors[i3]       = pointColor.r
        colors[i3 + 1]   = pointColor.g
        colors[i3 + 2]   = pointColor.b

        randomness[i3]     = Math.pow(Math.random(), debugObject.randomnessPower) * ( Math.random() > .5 ? -1 : 1) * debugObject.randomness * randomRadius
        randomness[i3 + 1] = Math.pow(Math.random(), debugObject.randomnessPower) * ( Math.random() > .5 ? -1 : 1) * debugObject.randomness * randomRadius
        randomness[i3 + 2] = Math.pow(Math.random(), debugObject.randomnessPower) * ( Math.random() > .5 ? -1 : 1) * debugObject.randomness * randomRadius
    
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
    
    material = new THREE.ShaderMaterial({
        vertexShader: `
            uniform float uSize;
            uniform float uTime;
            uniform float uRotationSpeed;

            attribute float aScale;
            attribute vec3 aColor;
            attribute vec3 aRandomness;

            varying vec2 vUv;
            varying vec3 vColor;
    
            void main() {

                vec4 bodyPosition = modelMatrix * vec4(position, 1.0);
                
                float angle = atan( bodyPosition.x, bodyPosition.z );
                
                float distanceToCenter = length(bodyPosition.xz);
                
                float angleOffset = ( 1.0 / distanceToCenter ) * uTime * uRotationSpeed;
                angle += angleOffset;

                // Set on a circle & set the distance
                bodyPosition.x = cos(angle) * distanceToCenter;
                bodyPosition.z = sin(angle) * distanceToCenter;

                bodyPosition.xyz += aRandomness.xyz;

                vec4 viewPosition = viewMatrix * bodyPosition;
                vec4 projectionPosition = projectionMatrix * viewPosition;
    
                gl_Position = projectionPosition;
    
                gl_PointSize = uSize * aScale;

                // Apply size attenuation
                gl_PointSize *= ( 1.0 / - viewPosition.z );

                vUv = uv;
                vColor = aColor;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;

            varying vec2 vUv;

            void main() {

                float distanceFromCenter = 1.0 - distance(gl_PointCoord, vec2(.5));
                distanceFromCenter = pow(distanceFromCenter, 6.0);

                vec3 finalColor = mix(vec3(0.0), vColor, distanceFromCenter);

                gl_FragColor = vec4(finalColor, 1.0);
                
            }

        `,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
        transparent: true,
        uniforms: {
            uSize: { value: debugObject.size },
            uTime: { value: 0 },
            uRotationSpeed: { value: debugObject.rotationSpeed }
        }
    })
    
    // ===================================
    // Mesh
    // ===================================
    mesh = new THREE.Points( geometry, material )
    scene.add(mesh)

}

generateGalaxy()

gui.add( debugObject, 'count', 1000, 500000, 100 ).onFinishChange(generateGalaxy).name('Stars')
gui.add( debugObject, 'size', .001, 20, .001 ).onFinishChange(generateGalaxy).name('Star size')
gui.add( debugObject, 'branches', 1, 10, 1 ).onFinishChange(generateGalaxy).name('Branches')
gui.add( debugObject, 'radius', .3, 4, .001 ).onFinishChange(generateGalaxy).name('Radius')
gui.add( debugObject, 'randomness', 0, 4, .001 ).onFinishChange(generateGalaxy).name('Randomness')
gui.add( debugObject, 'randomnessPower', 0, 10, .001 ).onFinishChange(generateGalaxy).name('RandomnessPower')
gui.add( debugObject, 'rotationSpeed', 0, 1, .01 ).onFinishChange(generateGalaxy).name('Rotation Speed')
gui.addColor( debugObject, 'innerColor').onFinishChange(generateGalaxy).name('Internal color')
gui.addColor( debugObject, 'outerColor').onFinishChange(generateGalaxy).name('External color')


// ===================================
// Camera
// ===================================
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 2
camera.position.z = 1
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.rotateSpeed = 0.03


// ===================================
// Renderer
// ===================================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    if ( material ) {
        material.uniforms.uTime.value = elapsedTime
    }

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

// ===================================
// Responsive
// ===================================
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})