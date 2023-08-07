// Handle command menu toggling
// Data for command menu is loaded using htmx on page load
function toggleCommandMenu() {
  const commandMenu = document.querySelector('[data-command-menu]')

  if (commandMenu.getAttribute('open') === null) {
    commandMenu.showModal()
  } else {
    commandMenu.close()
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'k' && event.metaKey) {
    toggleCommandMenu()
  }
})
