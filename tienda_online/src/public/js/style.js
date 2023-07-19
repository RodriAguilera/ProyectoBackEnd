// module.exports = {
    
//     plugins: [
    
//       require('@tailwindcss/aspect-ratio'),
//     ],
//   };

const boton = document.querySelector("#botonProfile");
const profile = document.querySelector('#profile');

boton.addEventListener('click', () => {
    profile.classList.toggle('hidden')
})