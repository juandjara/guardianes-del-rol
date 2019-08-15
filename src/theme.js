const defaultTheme = 'guardianes_rol';
const THEME_STORAGE_KEY = 'gdr_theme';

export function getInitialTheme() {
  const fromUrl = new URLSearchParams(window.location.search).get('theme');
  const fromStorage = window.localStorage.getItem(THEME_STORAGE_KEY);
  return fromUrl || fromStorage || defaultTheme;
}

export const themeOptions = [
  {label: 'Aniversario Lovecraft', value: 'aniv_lovecraft'},
  {label: 'El Dado Guardián', value: 'dado_guardian'},
  {label: 'Guardianes del Tablero', value: 'guardianes_jdm'},
  {label: 'Guardianes del Rol', value: 'guardianes_rol'},
  {label: 'Todas', value: 'all'}
];