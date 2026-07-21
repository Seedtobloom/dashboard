// Admin v2 SPA · Seed to Bloom. Servi par le worker front, parle au back via /api/*.
(function () {
  'use strict';

  var LOGO_SVG = '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.74 60.9"><g><path d="M62.29,19.87v.63c.09.09.12.28.12.47s-.03.41-.03.44l-.41.35c0,1.69-1.63,2.26-2.7,3.33-.6.63-1.16.44-1.88.72h-1.04c-.75.38-1.22.41-1.91.41h-.31c-.06,0-.22.06-.28.09l-.16-.09h-.38c-.82,0-1.38-.06-1.95-.19-.41-.06-1.6-.19-2.35-.19-.03,0-.25-.09-.31-.13h-1.1c-1.29-1.07-1.32-.06-1.32-1.82v-.25c0-.09-.12-.28-.19-.31v-1.1c0-.28-.03-.66-.22-.82v-.85l-.09-.16c0-.6.63-.75,1.1-.75.63,0,2.01,2.6,2.42,3.17h1.35c.47.31.94,1,1.54,1l.16-.09h.88c.16,0,.19-.22.38-.22.16,0,.22.19.38.22l.25-.13c.56.03,1,.03,1.57.03.88,0,3.2-1.44,3.2-2.42v-1.16c0-.53-1.69-2.79-2.2-2.79h-.44c-.56,0-.63-.25-.97-.6-2.35-.63-4.61-1.63-6.91-2.51-.85-1.04-1.6-2.13-2.39-3.17v-.69s.09,0,.09-.06c-.13-.28-.41-.85-.41-1.13,0-1.57,2.45-5.15,3.99-5.46.09-.03.19-.03.28-.03.16,0,.35.03.5.03.38,0,.66-.22.91-.5.44-.06.82-.22,1.26-.22h.5l.22.13.09-.09h.94l.09.09h1.1l.09-.13h1.82c.78,0,1.1.6,3.11.6.16.25.34.47.6.63v.75c0,.38-.28.66-.28,1l.09.22v.66l-.09.22.09.22v.97c-.13.16-.25.31-.41.41h-.69c0-1.32-2.86-2.79-4.02-2.79-.97,0-1.82-.19-2.83-.19l-.16-.09c-.69,0-3.67,1.22-3.7,1.95l.25.28c-.16.16-.38.44-.38.66,0,1.07,2.98,3.8,4.08,3.8.03,0,.09-.03.13-.03.09,0,.22-.09.31-.09.44,0,1.76.66,2.07,1h1.35c1.07.82,2.42,1.16,3.45,2.01.35.25.38.66.53,1.04.12.28.28.53.66.63.16.31.6,1.69.63,1.69v.85c-.06,0-.09.06-.09.09,0,.06.06.19.09.25l-.09.22Z"/><path d="M71.98,25.3c-.53.03-1.26,0-1.57.53h-.97l-.16.09c-.47-.03-.91-.25-1.29-.5h-.85c-.69-.35-2.1-1.07-2.1-1.95l.09-.16c-.44-.6-1.19-1.85-1.19-2.57,0-.35.09-.72.09-1.07l-.09-.13c.19-.63.5-1.32.5-1.98,0-.19-.03-.38-.09-.53.88-2.01,2.29-4.05,4.71-4.05h.13l.13-.09.41.09.31-.09c.22.13.44.25.66.28l.12-.09h.97c1,.66,1.82,1.57,2.6,2.51v.66c-1.73,1.22-3.77,1.92-5.84,2.32-.31.6-.94.94-1.6,1.07l-.13.35c0,1.32,2.32,2.92,3.52,2.95l.16-.09.28.03c0,.19.16.25.31.25,0,0,.19-.09.22-.09,1.44,0,2.2-1.1,2.76-1.1.28,0,.69.16.69.5,0,.82-2.2,2.29-2.79,2.86ZM69.69,14.98h-1.07l-.19.41c-.13-.03-.25-.19-.38-.19-1.26,0-1.19,1.66-1.63,2.48v.19c.16.16.06.66.25.66.75,0,3.3-1.91,3.92-2.48,0-.53-.63-.69-.91-1.07Z"/><path d="M84,25.3c-.53.03-1.26,0-1.57.53h-.97l-.16.09c-.47-.03-.91-.25-1.29-.5h-.85c-.69-.35-2.1-1.07-2.1-1.95l.09-.16c-.44-.6-1.19-1.85-1.19-2.57,0-.35.09-.72.09-1.07l-.09-.13c.19-.63.5-1.32.5-1.98,0-.19-.03-.38-.09-.53.88-2.01,2.29-4.05,4.71-4.05h.13l.13-.09.41.09.31-.09c.22.13.44.25.66.28l.12-.09h.97c1,.66,1.82,1.57,2.6,2.51v.66c-1.73,1.22-3.77,1.92-5.84,2.32-.31.6-.94.94-1.6,1.07l-.13.35c0,1.32,2.32,2.92,3.52,2.95l.16-.09.28.03c0,.19.16.25.31.25,0,0,.19-.09.22-.09,1.44,0,2.2-1.1,2.76-1.1.28,0,.69.16.69.5,0,.82-2.2,2.29-2.79,2.86ZM81.71,14.98h-1.07l-.19.41c-.13-.03-.25-.19-.38-.19-1.26,0-1.19,1.66-1.63,2.48v.19c.16.16.06.66.25.66.75,0,3.3-1.91,3.92-2.48,0-.53-.63-.69-.91-1.07Z"/><path d="M101.39,23.42c-.82.6-2.86,2.42-3.8,2.42-.57,0-.85-1.07-.85-1.51,0-.25.28-.47.28-.72,0-.16-.09-.25-.25-.25-.35,0-2.23,1.91-3.04,2.29h-1.44c-1.7,0-4.21-3.3-4.21-4.9v-.75l.09-.28c0-.19-.06-.38-.19-.53.03-.31.31-.69.31-.91,0-.13-.13-.25-.13-.41,0-.6.41-1.07.41-2.26,1.41-1.26,1.73-2.98,3.92-2.98.19,0,.34-.03.5-.13.72.03,1.29.6,1.98.6.16,0,.31-.09.47-.09.31,0,.6.22.94.22.31,0,.41-.31.63-.44v-.25c0-.19-.16-.5-.28-.63v-1.07l.09-.13-.09-.09v-1.66c0-1.1-2.1-.41-2.1-1.76,0-1.98,3.04-1.54,3.39-2.82h2.48c.09.19.31.53.31.72,0,.5-1.19,1.16-1.19,2.04,0,.31.19.56.19.85l-.09.19v.82l.09.06c-.16.22-.31.47-.31.72,0,.63.22,1.26.22,1.51s-.19.47-.19.72l.09.22c-.09.16-.22.31-.22.5,0,.28.31.5.31.78l-.09.19.09.13v.66l-.09.22v.16c0,.72-.22.85-.22,1.44l.09.19v.41c.03.09.06.25.13.35v1.41s-.09.03-.09.06v.63l-.12.19.09.16c0,.19-.03.44-.03.69,0,.82.13,1.79.94,1.79.22,0,.38-.22.6-.22.38,0,.5.53.5.82,0,.22-.09.44-.12.66ZM97.03,18.43c.06,0,.09-.06.09-.09v-1.22c-1.35-1-2.42-2.42-4.21-2.42-.91,0-2.64,1.26-2.64,2.23v.94l.09.22c0,2.32,1.54,4.3,3.83,4.3.13,0,.28,0,.44-.03l.25.09c.72,0,2.13-2.23,2.13-2.89,0-.13-.09-.25-.09-.38,0-.22.19-.38.22-.6l-.13-.16ZM98.82,19.78l-.19.09v.19h.19v-.28Z"/></g><g><path d="M114.51,14.44c0,.28.03.44.03.6s-.03.31-.16.56c-.28,0-.53.09-.82.09-.35,0-.63-.31-.97-.31h-1.13c0,.06-.06.09-.09.13h-.6c-.16.35-.34.66-.34,1.07l.09.13v1.13s-.09.06-.09.09l.19.28v.75l-.09.22v.22c0,.53-.09.47-.09.66,0,.44.28.79.28,1.19l-.09.25c0,.35.6,1.35,1.1,1.35.06-.03.22-.09.31-.09.12,0,.25.09.38.09.53,0,1.13-.79,1.6-.79l.41.31v.94l.09.03c-.38,1.38-1.63,2.48-3.08,2.48-.16,0-.31-.09-.47-.09-.19,0-.28.28-.47.28-.5,0-2.57-1.66-2.92-2.1-.06-.28-.09-.53-.22-.78l.09-.22c0-.22-.03-.41-.03-.63l.13-.25v-1.44c.12-.16.19-.38.19-.56,0-.28,0-.63-.19-.88v-.66l.09-.25c0-.22-.03-.41-.03-.6,0-.38.03-.75.03-1.16,0-.31-.12-.66-.31-.88h-.85l-.13.09-.12-.09h-.75c-.12-.5-.31-.94-.31-1.44,0-.28.28-1,.5-1.16h1.44c1.07-1.1,1.57-2.64,2.86-3.58h.66c.13.22.41.94.41,1.16s-.19.72-.19,1.26c0,.13-.06.35-.12.53v.69c.16.06.28.16.41.16.34,0,.6-.31.94-.31.22,0,.41.09.63.09.16,0,.31-.06.44-.19.19,0,.34.03.53.03.06,0,.25,0,.25-.13.22.09.41.25.6.41v.75l.09.19c0,.13-.09.25-.09.38Z"/><path d="M128.42,19.34l-.09.09v1.1c0,1.26-2.1,4.9-3.48,4.9l-.22-.09c-.28,0-.5.19-.79.19l-.31-.19-.28.19h-.53c-.12,0-.28.06-.34.22h-1.38c-.72-.63-1.6-.69-2.35-1.13-.75-.41-1.32-1.79-1.82-2.48v-.63c-.19-.06-.22-.25-.22-.5,0-.19,0-.41-.28-.44l.09-.41-.09-.19v-.97c.25-.38.28-.5.28-.78v-.41l.22-.31c0-.25-.09-.47-.09-.69,0-1.04,1.98-2.86,2.7-3.58.63-.03,1.16-.5,1.82-.5l.19.09.25-.09c.34,0,.85.38,1.13.6.19,0,.41-.09.47-.31h.47c.35.22.41.25.47.25.09,0,.16-.03.44-.03,1.79,0,3.8,4.14,3.8,5.84,0,.09-.03.19-.03.28ZM125.43,19.24v-.75c-.31-.44-.19-1.04-.5-1.48-.34-.5-1.07-.69-1.19-1.32l-.16.03c-.25,0-.44-.19-.63-.35h-.66l-.13-.19h-.79c-1.32,0-2.42,1.48-2.42,2.67l.12.25-.22.56v.88c.53.91.72,2.07,1.48,2.82.38.38,1.47.97,2.01.97l.16-.09.09.09c1.48-.03,2.73-1.22,2.73-2.64v-.25l.09-.22v-.66l.12-.16-.12-.19ZM126.03,16.8l-.19.09v.19h.19v-.28Z"/></g><path d="M0,57.82c.73-4.62,1.44-9.09,2.13-13.4.69-4.32,1.29-8.21,1.79-11.67.51-3.46.91-6.29,1.22-8.48.3-2.19.46-3.46.46-3.83,0-1.58-.85-2.37-2.55-2.37H.55l.36-2.31c.85,0,1.85-.02,3.01-.06,1.16-.04,2.34-.09,3.56-.15,1.22-.06,2.29-.11,3.22-.15l.55.73c-.53,2.27-1.08,4.76-1.67,7.48-.59,2.72-1.15,5.49-1.7,8.33-.55,2.84-1.06,5.6-1.55,8.3-.49,2.7-.89,5.18-1.22,7.45l.18.12c1.38-2.92,2.63-5.39,3.77-7.42,1.13-2.03,2.26-3.73,3.37-5.11,1.11-1.38,2.26-2.55,3.43-3.52,1.82,0,3.31.88,4.47,2.64,1.15,1.76,1.73,4.06,1.73,6.9,0,2.47-.38,4.85-1.12,7.14-.75,2.29-1.77,4.34-3.07,6.14-1.3,1.8-2.76,3.23-4.38,4.28-1.62,1.05-3.32,1.58-5.11,1.58-.81,0-1.68-.06-2.61-.18-.93-.12-1.84-.29-2.73-.52-.89-.22-1.7-.48-2.43-.76L0,57.82ZM15.07,36.79c-.49,0-1.1.44-1.85,1.31-.75.87-1.61,2.13-2.58,3.77-.97,1.64-2.03,3.64-3.16,5.99-1.13,2.35-2.33,4.98-3.59,7.9,1.01.36,2.21.69,3.59.97,1.38.28,2.45.43,3.22.43,1.22,0,2.37-.62,3.46-1.85,1.09-1.24,1.98-2.85,2.67-4.83.69-1.98,1.03-4.07,1.03-6.26,0-1.3-.13-2.51-.39-3.65-.26-1.13-.61-2.05-1.03-2.74-.43-.69-.88-1.03-1.37-1.03Z"/><path d="M31.42,56.3c.32,0,.77-.22,1.34-.67.57-.45,1.72-1.42,3.46-2.92l.73.06.79,1.46c-1.38,1.38-2.62,2.55-3.74,3.53-1.12.97-2.07,1.7-2.86,2.19s-1.43.73-1.92.73c-1.26,0-1.88-.59-1.88-1.76,0-.16.1-.93.3-2.31.2-1.38.48-3.15.82-5.32.34-2.17.72-4.55,1.12-7.14.4-2.59.81-5.21,1.22-7.84.4-2.63.78-5.08,1.12-7.32.34-2.25.62-4.13.82-5.65.2-1.52.3-2.46.3-2.83,0-1.62-.85-2.43-2.55-2.43h-2.49l.36-2.31c.93,0,1.95-.02,3.07-.06,1.11-.04,2.19-.08,3.22-.12,1.03-.04,2.2-.1,3.5-.18l.55.73c-.53,2.43-1.01,4.71-1.46,6.84-.45,2.13-.94,4.54-1.49,7.23-.55,2.7-1.1,5.54-1.67,8.54-.57,3-1.09,5.98-1.58,8.93-.49,2.96-.91,5.75-1.28,8.39l.18.24Z"/><path d="M48.14,60.68c-1.99,0-3.62-.9-4.89-2.71-1.28-1.8-1.92-4.22-1.92-7.26,0-2.51.37-4.9,1.09-7.17.73-2.27,1.74-4.29,3.04-6.05s2.78-3.16,4.44-4.19c1.66-1.03,3.4-1.55,5.23-1.55,2.15,0,3.84.79,5.08,2.37,1.24,1.58,1.85,3.81,1.85,6.69,0,2.67-.37,5.21-1.09,7.6-.73,2.39-1.73,4.51-3.01,6.35-1.28,1.84-2.76,3.29-4.44,4.35s-3.47,1.58-5.38,1.58ZM50.57,57.34c1.34,0,2.53-.57,3.59-1.7,1.05-1.13,1.87-2.7,2.46-4.71.59-2.01.88-4.26.88-6.78,0-2.71-.44-4.85-1.31-6.41-.87-1.56-2.08-2.34-3.62-2.34-1.3,0-2.47.54-3.52,1.61-1.05,1.07-1.88,2.53-2.46,4.38-.59,1.84-.88,3.94-.88,6.29,0,2.84.46,5.16,1.37,6.96.91,1.8,2.08,2.7,3.5,2.7Z"/><path d="M72.81,60.68c-1.99,0-3.62-.9-4.89-2.71-1.28-1.8-1.92-4.22-1.92-7.26,0-2.51.37-4.9,1.09-7.17.73-2.27,1.74-4.29,3.04-6.05s2.78-3.16,4.44-4.19c1.66-1.03,3.4-1.55,5.23-1.55,2.15,0,3.84.79,5.08,2.37,1.24,1.58,1.85,3.81,1.85,6.69,0,2.67-.37,5.21-1.09,7.6-.73,2.39-1.73,4.51-3.01,6.35-1.28,1.84-2.76,3.29-4.44,4.35s-3.47,1.58-5.38,1.58ZM75.25,57.34c1.34,0,2.53-.57,3.59-1.7,1.05-1.13,1.87-2.7,2.46-4.71.59-2.01.88-4.26.88-6.78,0-2.71-.44-4.85-1.31-6.41-.87-1.56-2.08-2.34-3.62-2.34-1.3,0-2.47.54-3.52,1.61-1.05,1.07-1.88,2.53-2.46,4.38-.59,1.84-.88,3.94-.88,6.29,0,2.84.46,5.16,1.37,6.96.91,1.8,2.08,2.7,3.5,2.7Z"/><path d="M124.36,56.3c.2,0,.43-.07.7-.21.26-.14.71-.48,1.34-1,.63-.53,1.57-1.32,2.83-2.37l.73.06.79,1.46c-1.54,1.46-2.88,2.67-4.01,3.62-1.13.95-2.08,1.66-2.83,2.13-.75.47-1.35.7-1.79.7-1.26,0-1.88-.59-1.88-1.76,0-.73.17-1.71.52-2.95.34-1.24.76-2.6,1.25-4.1.49-1.5.97-3.01,1.46-4.53s.9-2.94,1.25-4.25c.34-1.32.52-2.38.52-3.19,0-.73-.19-1.33-.58-1.79-.39-.47-.88-.7-1.49-.7-.85,0-1.92.75-3.22,2.25-1.3,1.5-2.69,3.58-4.19,6.23-1.5,2.65-3,5.74-4.5,9.27l-.73,3.95c0,.12-.25.29-.76.52-.51.22-1.05.43-1.64.61-.59.18-1.04.27-1.37.27l-.42-.55c.4-1.74.76-3.3,1.06-4.68.3-1.38.63-2.88.97-4.5.34-1.62.67-3.19.97-4.71.3-1.52.56-2.84.76-3.95.2-1.11.3-1.85.3-2.22,0-.73-.19-1.33-.58-1.79-.39-.47-.88-.7-1.49-.7-.81,0-1.81.69-3.01,2.07-1.2,1.38-2.47,3.31-3.83,5.8-1.36,2.49-2.73,5.38-4.1,8.66l-.67,5.17c0,.12-.25.29-.76.52-.51.22-1.05.43-1.64.61-.59.18-1.04.27-1.37.27l-.43-.55c.32-1.98.61-3.77.85-5.35.24-1.58.52-3.28.82-5.11.3-1.82.58-3.58.82-5.26.24-1.68.45-3.13.61-4.35.16-1.22.24-1.98.24-2.31,0-.85-.2-1.47-.61-1.85-.41-.38-1.07-.58-2.01-.58h-2.49l.43-2.31c.93,0,1.95-.02,3.07-.06,1.11-.04,2.19-.08,3.22-.12,1.03-.04,2.22-.1,3.56-.18l.55.73c-.53,1.66-.99,3.18-1.4,4.56-.41,1.38-.82,2.93-1.25,4.65-.43,1.72-.78,3.47-1.06,5.26l.18.18c2.07-4.13,4.13-7.58,6.2-10.33,2.07-2.75,4.03-4.68,5.9-5.77,1.3,0,2.4.56,3.31,1.67.91,1.11,1.37,2.44,1.37,3.98,0,.53-.12,1.35-.36,2.46-.24,1.11-.54,2.27-.88,3.46-.34,1.2-.76,2.64-1.25,4.35l.18.18c2.03-3.97,4.13-7.36,6.32-10.18,2.19-2.82,4.27-4.79,6.26-5.93,1.3,0,2.37.54,3.22,1.61.85,1.07,1.28,2.42,1.28,4.04,0,1.09-.22,2.43-.67,4.01-.45,1.58-.97,3.25-1.58,5.01-.61,1.76-1.21,3.49-1.79,5.17-.59,1.68-1.04,3.17-1.37,4.47l.18.24Z"/></svg>';

  var VIEW = 'priorities';   // priorities | clients | newclient | client | chat
  var CURKEY = null;         // client courant
  var CUR = null;            // détail client courant
  var TAB = 'infos';         // onglet du détail client
  var SUBTAB = {};           // sous-onglet actif par domaine
  var CHAT = { key: null, project: null }; // vue chat globale

  var DOMAIN_LABELS = { partner: 'Partenaire créative', website: 'Site web', branding: 'Identité visuelle', maintenance: 'Espace tickets' };
  var DA_BANNER = [['#412F21', 'Terre'], ['#1C1205', 'Nuit'], ['#8B6F52', 'Argile'], ['#E4D1FE', 'Glycine'], ['#F2E5C2', 'Paille'], ['#F0E8FF', 'Brume']];
  var ADM_ICONS = {
    priorities: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
    mytasks: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    planning: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    kpi: 'M3 3v18h18M18 17V9M13 17V5M8 17v-3',
    done: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    clients: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    avis: 'M11.5 3l2.5 5.1 5.6.8-4 3.9 1 5.6-5-2.6-5 2.6 1-5.6-4-3.9 5.6-.8z',
    emails: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7',
    video: 'M23 7l-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
    visios: 'M23 7l-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
    questionnaires: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9M8 7h6M8 11h3',
    inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    reglages: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
    projtpl: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    incidents: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    stepClient: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    stepStudio: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    stepValid: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    deliv: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12',
    maint: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  };
  function admIcon(name) { var d = ADM_ICONS[name]; return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">' + (d ? '<path d="' + d + '"/>' : '') + '</svg>'; }
  var TASK_STATUS = [['todo', 'À faire'], ['in_progress', 'En cours'], ['review', 'À valider'], ['done', 'Terminé']];
  var STEP_STATUS = [['upcoming', 'À venir'], ['in_progress', 'En cours'], ['waiting_client', 'Action client'], ['done', 'Terminé']];

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function fmtDate(d) { if (!d) return '·'; var t = new Date(d); return isNaN(t) ? esc(d) : t.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function fmtDT(d) { if (!d) return ''; var t = new Date(d); return isNaN(t) ? '' : t.toLocaleString('fr-FR'); }
  function el(id) { return document.getElementById(id); }
  function api(path, opts) { return fetch(path, Object.assign({ credentials: 'same-origin' }, opts || {})); }
  function jpost(path, body, method) { return api(path, { method: method || 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
  function toast(m) { var t = el('toast'); if (!t) return; t.textContent = m; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2600); }
  // ── Uploads : garde-fou de taille + lecture d'erreur robuste ──
  // La limite Cloudflare coupe la connexion des gros fichiers avant de
  // répondre en JSON : sans ces garde-fous, l'utilisatrice ne voit qu'un
  // « Erreur, réessaie » sans comprendre que le fichier est trop lourd.
  var ADM_MAX_MB = 100;
  function admTooBig(f) { return (f && typeof f.size === 'number' && f.size > ADM_MAX_MB * 1024 * 1024) ? Math.round(f.size / 1048576) : 0; }
  function admBigMsg(f) { if (!admTooBig(f)) return ''; var mo = (f.size / 1048576).toFixed(1); return 'Ce fichier fait ' + mo + ' Mo, au-delà du plafond de ' + ADM_MAX_MB + ' Mo (limite technique). Pour un livrable lourd (zip, vidéo…), dépose-le en lien via le bouton « Lien » (WeTransfer, Drive, Figma…) — la cliente pourra le valider pareil.'; }
  // Ne jette jamais sur une réponse non-JSON (413/500 HTML) : renvoie {ok,status,d}.
  function admUploadResult(r) { return r.text().then(function (t) { var d = {}; try { d = t ? JSON.parse(t) : {}; } catch (e) { d = {}; } return { ok: r.ok, status: r.status, d: d }; }); }
  function admUploadErrMsg(status, base) { return status === 413 ? 'Fichier trop lourd (' + ADM_MAX_MB + ' Mo max). Pour un fichier volumineux (zip, vidéo…), dépose-le en lien (WeTransfer, Drive, Figma…).' : (base || 'Erreur — envoi impossible, réessaie'); }
  // Confirmation oui / non stylée pour les boutons importants (envois d'e-mail, suppressions…)
  function admConfirm(opts, onYes) {
    opts = opts || {};
    var ac = opts.danger ? '#b5462f' : 'var(--terre)';
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box">' +
      '<div class="admconfirm__title">' + esc(opts.title || 'Confirmer') + '</div>' +
      (opts.message ? '<div class="admconfirm__msg">' + opts.message + '</div>' : '') +
      (opts.detail ? '<div class="admconfirm__detail">' + opts.detail + '</div>' : '') +
      '<div class="admconfirm__row">' +
        '<button class="btn btn--outline btn--sm" data-no>' + esc(opts.no || 'Non, annuler') + '</button>' +
        '<button class="btn btn--sm" data-yes style="background:' + ac + ';color:#fff;border-color:' + ac + '">' + esc(opts.yes || 'Oui, envoyer') + '</button>' +
      '</div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () { close(); onYes(); };
    document.body.appendChild(ov);
    var y = ov.querySelector('[data-yes]'); if (y) y.focus();
  }
  // Popup « Prévenir la cliente ? » : renvoie cb(notify) — par défaut « envoyer
  // sans prévenir » (bouton principal). Cliquer à l'extérieur annule.
  function notifyConfirm(message, cb) {
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box">' +
      '<div class="admconfirm__title">Prévenir la cliente ?</div>' +
      '<div class="admconfirm__msg">' + esc(message || 'Souhaites-tu que la cliente soit prévenue par e-mail ?') + '</div>' +
      '<div class="admconfirm__row" style="flex-wrap:wrap;gap:8px">' +
        '<button class="btn btn--outline btn--sm" data-cancel>Annuler</button>' +
        '<button class="btn btn--outline btn--sm" data-notify>Oui, prévenir</button>' +
        '<button class="btn btn--sm" data-silent style="background:var(--terre);color:#fff;border-color:var(--terre)">Envoyer sans prévenir</button>' +
      '</div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-cancel]').onclick = close;
    ov.querySelector('[data-notify]').onclick = function () { close(); cb(true); };
    ov.querySelector('[data-silent]').onclick = function () { close(); cb(false); };
    document.body.appendChild(ov);
    var s = ov.querySelector('[data-silent]'); if (s) s.focus();
  }
  function pill(status, label) { return '<span class="pill pill--' + esc(status) + '">' + esc(label || status) + '</span>'; }
  function jsq(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function remind(key, kind, title, projectLabel) {
    admConfirm({
      title: 'Envoyer une relance par e-mail ?',
      message: 'Le client recevra un e-mail de relance' + (title ? ' concernant « ' + esc(title) + ' »' : '') + '.',
      yes: 'Oui, relancer', no: 'Non'
    }, function () {
      jpost('/api/clients/' + key + '/remind', { kind: kind, title: title, projectLabel: projectLabel }).then(function (r) { if (r.ok) toast('Relance envoyée par mail ✓'); else toast('Erreur'); });
    });
  }
  function badge(n) { return n > 0 ? '<span style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--glycine);color:var(--terre);font-family:var(--font-micro);font-size:10px;font-weight:700;margin-left:6px">' + n + '</span>' : ''; }
  function badgeAlert(n) { return n > 0 ? '<span title="Révision(s) à faire" style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#a23c28;color:#fff;font-family:var(--font-micro);font-size:10px;font-weight:700;margin-left:6px">' + n + '</span>' : ''; }

  /* ── boot / auth ── */
  function boot() {
    api('/api/me').then(function (r) {
      if (r.status === 401) { showLogin(); return null; }
      if (!r.ok) throw new Error();
      return r.json();
    }).then(function (d) { if (d) { VIEW = 'priorities'; renderShell(); startPoll(); } }).catch(showError);
  }
  var _poll = null;
  function startPoll() {
    if (_poll) return;
    _poll = setInterval(refreshUnread, 60000); setInterval(refreshOpenChat, 15000);
    // Rafraîchit à la volée quand on revient sur l'onglet (les intervalles
    // ne tournent pas quand l'onglet est masqué → on économise le quota KV).
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refreshUnread(); });
  }
  // Rafraîchit le fil de discussion ouvert (messagerie globale ou fiche client)
  // sans toucher au champ de saisie : les nouveaux messages arrivent seuls.
  function refreshOpenChat() {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    function updateBox(box, dom) {
      if (!box || !dom) return;
      var html = chatBubbles(dom, '');
      if (box.innerHTML === html) return;
      var atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
      box.innerHTML = html;
      if (atBottom) box.scrollTop = box.scrollHeight;
    }
    if (VIEW === 'chat' && CHAT.key && CHAT.project) {
      api('/api/clients/' + CHAT.key).then(function (r) { return r.json(); }).then(function (d) {
        if (VIEW !== 'chat' || CHAT.key !== d.key) return;
        CUR = d; CURKEY = CHAT.key;
        var dom = findDomain(CHAT.project); if (!dom) return;
        updateBox(el('chatmsgs'), dom);
        if (dom.unread > 0) { jpost('/api/clients/' + CHAT.key + '/message/read', { projectId: CHAT.project }, 'POST'); dom.unread = 0; }
      }).catch(function () {});
    } else if (VIEW === 'client' && CURKEY && document.querySelector('[id^="chat-"]')) {
      api('/api/clients/' + CURKEY).then(function (r) { return r.json(); }).then(function (d) {
        if (VIEW !== 'client' || !CUR || CUR.key !== d.key) return;
        CUR = d;
        var boxes = document.querySelectorAll('[id^="chat-"]');
        for (var i = 0; i < boxes.length; i++) {
          var dom = findDomain(boxes[i].id.slice(5));
          if (dom) updateBox(boxes[i], dom);
        }
      }).catch(function () {});
    }
  }
  function showError() { el('app').innerHTML = '<div class="center"><p class="muted">Erreur. <a href="javascript:location.reload()">Réessayer</a></p></div>'; }

  function showLogin(err) {
    el('app').innerHTML =
      '<div class="login"><div class="login__card">' +
      '<div class="login__logo">' + LOGO_SVG + '</div><div class="login__sub">Administration</div>' +
      '<div class="field"><label>Clé A</label><input id="lg-a" class="inp" type="password" autocomplete="off" maxlength="32"></div>' +
      '<div class="field"><label>Clé B</label><input id="lg-b" class="inp" type="password" autocomplete="off" maxlength="32"></div>' +
      '<div class="err" id="lg-err"' + (err ? ' style="display:block"' : '') + '>' + (err ? esc(err) : '') + '</div>' +
      '<button class="btn btn--dark btn--block" id="lg-btn" onclick="ADM.login()">Se connecter</button>' +
      '</div></div>';
    var b = el('lg-b'); if (b) b.addEventListener('keydown', function (e) { if (e.key === 'Enter') login(); });
  }
  function login() {
    var a = (el('lg-a').value || '').trim(), b = (el('lg-b').value || '').trim();
    var er = el('lg-err');
    if (!a || !b) { er.textContent = 'Les deux clés sont requises.'; er.style.display = 'block'; return; }
    var btn = el('lg-btn'); btn.disabled = true; btn.textContent = 'Connexion…';
    jpost('/api/login', { keyA: a, keyB: b }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) { boot(); } else { er.textContent = (res.d && res.d.error) || 'Clés invalides'; er.style.display = 'block'; btn.disabled = false; btn.textContent = 'Se connecter'; } })
      .catch(function () { er.textContent = 'Erreur réseau'; er.style.display = 'block'; btn.disabled = false; btn.textContent = 'Se connecter'; });
  }
  function logout() { api('/api/logout', { method: 'POST' }).then(function () { location.reload(); }); }

  /* ── shell ── */
  function nav(v) { VIEW = v; if (v !== 'client') CURKEY = null; renderShell(); window.scrollTo(0, 0); }
  var NAV_CLIENTS = [], NAV_OPEN = {};
  function buildNavHtml() {
    var groups = [
      ['Mon travail', [['inbox', 'Inbox'], ['priorities', 'Priorités'], ['mytasks', 'Mes tâches'], ['visios', 'Visios'], ['questionnaires', 'Questionnaires'], ['projtpl', 'Modèles de projets'], ['planning', 'Calendrier'], ['done', 'Réalisé']]],
      ['Pilotage', [['kpi', 'Tableau de bord'], ['avis', 'Avis'], ['incidents', 'Incidents'], ['reglages', 'Réglages']]],
    ];
    function navItemHtml(it) {
      var badgeSpan = (it[0] === 'chat' || it[0] === 'clients' || it[0] === 'priorities' || it[0] === 'mytasks' || it[0] === 'inbox' || it[0] === 'incidents') ? '<span id="nav-unread-' + it[0] + '" style="margin-left:auto"></span>' : '';
      return '<button class="navitem' + ((VIEW === it[0] || (VIEW === 'newclient' && it[0] === 'clients')) ? ' active' : '') + '" onclick="ADM.nav(\'' + it[0] + '\')">' + admIcon(it[0]) + '<span>' + it[1] + '</span>' + badgeSpan + '</button>';
    }
    // Accès direct : chaque client a son entrée, dépliable en sous-sections.
    function clientNavHtml(c) {
      var isCur = VIEW === 'client' && CURKEY === c.key;
      // NAV_OPEN[key] : true/false explicite si l'utilisateur a cliqué le chevron,
      // undefined = défaut (déplié seulement si c'est le client courant).
      var open = NAV_OPEN[c.key] === true || (NAV_OPEN[c.key] === undefined && isCur);
      var nm = clientName(c);
      var subs = [['infos', 'Infos', 0]];
      (c.sections || []).forEach(function (x) { subs.push([x.id, x.label, x.unread || 0]); });
      subs.push(['journal', 'Journal', 0]);
      subs.push(['documents', 'Documents', 0]);
      subs.push(['qnranswers', 'Questionnaires', 0]);
      subs.push(['bilanavis', 'Bilan & avis', 0]);
      var pr = presence(c.lastSeen);
      var av = '<span style="position:relative;flex-shrink:0;width:22px;height:22px">' +
        '<span style="width:22px;height:22px;border-radius:50%;background:rgba(242,229,194,0.16);display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-display);font-style:italic;font-size:12px">' + esc((nm[0] || '?').toUpperCase()) + '</span>' +
        (pr.online ? '<span title="En ligne" style="position:absolute;bottom:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 2px var(--nuit,#2a1f16)"></span>' : '') +
        '</span>';
      var head = '<button class="navitem' + (isCur ? ' active' : '') + '" onclick="ADM.navClientTab(\'' + c.key + '\',null)" style="padding-right:6px" title="' + esc(pr.label) + '">' +
        av +
        '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(nm) + '</span>' +
        (c.unread > 0 ? badge(c.unread) : '') +
        '<span onclick="event.stopPropagation();ADM.navToggleClient(\'' + c.key + '\')" title="' + (open ? 'Replier' : 'Déplier') + '" style="margin-left:auto;padding:2px 7px;opacity:0.55;font-size:10px">' + (open ? '▾' : '▸') + '</span></button>';
      var subsHtml = open ? subs.map(function (sub) {
        var on = isCur && TAB === sub[0];
        return '<button class="navitem" onclick="ADM.navClientTab(\'' + c.key + '\',\'' + sub[0] + '\')" style="padding:6px 12px 6px 44px;font-size:12.5px;' + (on ? 'color:var(--paille)' : 'opacity:0.72') + '">' +
          '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(sub[1]) + '</span>' + (sub[2] > 0 ? badge(sub[2]) : '') + '</button>';
      }).join('') : '';
      return head + subsHtml;
    }
    var clientsGroup = '<div class="navgroup__label" style="margin-top:14px">Mes clients</div>' +
      navItemHtml(['clients', 'Clients']) +
      NAV_CLIENTS.map(clientNavHtml).join('') +
      navItemHtml(['chat', 'Messagerie']);
    return navItemsGroup(groups[0], false) + clientsGroup + navItemsGroup(groups[1], true);
    function navItemsGroup(g, mt) {
      return '<div class="navgroup__label"' + (mt ? ' style="margin-top:14px"' : '') + '>' + g[0] + '</div>' + g[1].map(navItemHtml).join('');
    }
  }
  var BADGE_CACHE = { chat: '', clients: '', priorities: '', mytasks: '', inbox: '' };
  function paintBadges() { ['chat', 'clients', 'priorities', 'mytasks', 'inbox'].forEach(function (k) { var b = el('nav-unread-' + k); if (b) b.innerHTML = BADGE_CACHE[k] || ''; }); }
  function renderNav() { var n = el('side-nav'); if (n) { n.innerHTML = buildNavHtml(); paintBadges(); } }
  function navToggleClient(key) {
    var isCur = VIEW === 'client' && CURKEY === key;
    var open = NAV_OPEN[key] === true || (NAV_OPEN[key] === undefined && isCur);
    NAV_OPEN[key] = !open; // bascule explicite, y compris pour le client courant
    renderNav();
  }
  function navClientTab(key, tab) {
    var sameClient = CUR && CUR.key === key;
    CURKEY = key; VIEW = 'client'; NAV_OPEN[key] = true;
    TAB = tab || TAB_BY_CLIENT[key] || 'infos';
    if (tab) TAB_BY_CLIENT[key] = tab;
    renderShell(); // renderClient charge le client si besoin
    if (sameClient) loadClient(); // même client : on rafraîchit en arrière-plan
  }
  var TAB_BY_CLIENT = {};
  function renderShell() {
    el('app').innerHTML =
      '<div class="shell"><aside class="side">' +
      '<div class="side__brand"><div class="side__logo" title="Seed to Bloom">' + LOGO_SVG + '</div><div class="s">Administration</div></div>' +
      '<nav class="side__nav" id="side-nav">' + buildNavHtml() + '</nav>' +
      '<div id="nav-timer-slot">' + navTimerHtml() + '</div>' +
      '<div class="side__foot"><button class="btn btn--outline btn--block btn--sm" style="color:var(--paille);border-color:rgba(242,229,194,0.25)" onclick="ADM.logout()">Déconnexion</button></div>' +
      '</aside><div class="main" id="main"></div></div>' +
      '<div id="notif-panel" class="notifpanel" style="display:none"></div>' +
      '<button id="notif-fab" class="notiffab" style="display:none" onclick="ADM.notifToggle()" title="Nouvelles tâches de vos clients"></button>';
    renderMain();
    refreshUnread();
  }
  // Notifications persistantes : tâches créées par les clients, tant qu'elles ne
  // sont pas traitées (bouton « Vu » ou tâche passée au-delà de « à faire »).
  var NEW_TASKS = [], REWORK_TASKS = [], COMMENT_TASKS = [], NOTIF_OPEN = false;
  function notifCount() { return NEW_TASKS.length + REWORK_TASKS.length + COMMENT_TASKS.length; }
  function bell() { return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path></svg>'; }
  function paintNotif() {
    var fab = el('notif-fab'), panel = el('notif-panel');
    if (!fab || !panel) return;
    var n = notifCount();
    if (n === 0) { fab.style.display = 'none'; panel.style.display = 'none'; NOTIF_OPEN = false; }
    else {
      fab.style.display = 'flex';
      fab.innerHTML = bell() + '<span class="notiffab__c">' + n + '</span>';
    }
    if (NOTIF_OPEN && n > 0) { panel.style.display = 'block'; panel.innerHTML = notifPanelHtml(); }
    else panel.style.display = 'none';
  }
  function notifPanelHtml() {
    var commentRows = COMMENT_TASKS.map(function (t) {
      var when = t.at ? new Date(t.at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '';
      var txt = (t.text || '').trim();
      return '<div style="padding:13px 15px;border-bottom:1px solid var(--bone-d);background:#f4f1fa">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">' +
          '<div style="font-weight:600;color:var(--terre);font-size:14px;min-width:0">' + esc(t.title || 'Sans titre') + '</div>' +
          (when ? '<span class="micro" style="color:var(--muted);flex-shrink:0;text-transform:none;letter-spacing:0">' + when + '</span>' : '') +
        '</div>' +
        '<div class="micro" style="color:#6c4ea4;text-transform:none;letter-spacing:0;margin-top:3px;font-weight:600">💬 Nouveau commentaire de ' + esc(t.client) + '</div>' +
        (txt ? '<div style="font-size:12.5px;color:var(--terre-600);line-height:1.5;margin-top:5px;font-style:italic;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">« ' + esc(txt) + ' »</div>' : '') +
        '<div style="display:flex;gap:7px;margin-top:9px">' +
          '<button class="btn btn--dark btn--sm" onclick="ADM.notifOpen(\'' + t.key + '\',\'' + t.id + '\')">Ouvrir</button>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.notifAckComment(\'' + t.key + '\',\'' + t.id + '\')">Vu</button>' +
        '</div></div>';
    }).join('');
    var reworkRows = REWORK_TASKS.map(function (t) {
      var when = t.at ? new Date(t.at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '';
      return '<div style="padding:13px 15px;border-bottom:1px solid var(--bone-d);background:#f3f6f0">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">' +
          '<div style="font-weight:600;color:var(--terre);font-size:14px;min-width:0">' + esc(t.title || 'Sans titre') + '</div>' +
          (when ? '<span class="micro" style="color:var(--muted);flex-shrink:0;text-transform:none;letter-spacing:0">' + when + '</span>' : '') +
        '</div>' +
        '<div class="micro" style="color:#3f5a37;text-transform:none;letter-spacing:0;margin-top:3px;font-weight:600">↩ Retours reçus · à retravailler de ton côté</div>' +
        '<div class="micro" style="color:var(--glycine-900);text-transform:none;letter-spacing:0;margin-top:2px">' + esc(t.client) + '</div>' +
        '<div style="display:flex;gap:7px;margin-top:9px">' +
          '<button class="btn btn--dark btn--sm" onclick="ADM.notifOpen(\'' + t.key + '\',\'' + t.id + '\')">Ouvrir</button>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.notifAckRework(\'' + t.key + '\',\'' + t.id + '\')">Vu</button>' +
        '</div></div>';
    }).join('');
    var rows = NEW_TASKS.map(function (t) {
      var when = t.createdAt ? new Date(t.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '';
      var content = (t.content || '').trim();
      var preview = content ? '<div style="font-size:12.5px;color:var(--terre-600);line-height:1.5;margin-top:5px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">' + esc(content) + '</div>' : '<div style="font-size:12px;font-style:italic;color:var(--muted);margin-top:5px">Sans description.</div>';
      var att = t.attCount ? '<span style="font-size:11px;color:var(--muted);margin-left:8px">📎 ' + t.attCount + '</span>' : '';
      var attDl = (Array.isArray(t.attachments) && t.attachments.length)
        ? '<div style="margin-top:7px;display:flex;flex-wrap:wrap;gap:6px">' + t.attachments.map(function (a) {
            return '<a href="/api/clients/' + t.key + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;font-size:11.5px;padding:4px 9px;border-radius:8px;border:1px solid var(--bone-d);color:var(--glycine-900);text-decoration:none">📎 ' + esc(a.name || 'fichier') + '</a>';
          }).join('') + '</div>'
        : '';
      return '<div style="padding:13px 15px;border-bottom:1px solid var(--bone-d)">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">' +
          '<div style="font-weight:600;color:var(--terre);font-size:14px;min-width:0">' + (t.kind === 'ticket' ? '<span title="Ticket de maintenance">🎫 </span>' : '') + esc(t.title || 'Sans titre') + att + '</div>' +
          (when ? '<span class="micro" style="color:var(--muted);flex-shrink:0;text-transform:none;letter-spacing:0">' + when + '</span>' : '') +
        '</div>' +
        '<div class="micro" style="color:var(--glycine-900);text-transform:none;letter-spacing:0;margin-top:2px">' + esc(t.client) + '</div>' +
        preview + attDl +
        '<div style="display:flex;gap:7px;margin-top:9px">' +
          '<button class="btn btn--dark btn--sm" onclick="ADM.notifOpen(\'' + t.key + '\',\'' + t.id + '\')">Ouvrir</button>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.notifAck(\'' + t.key + '\',\'' + t.id + '\')">Vu</button>' +
        '</div></div>';
    }).join('');
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 15px;border-bottom:1px solid var(--bone-d)">' +
      '<strong style="font-family:var(--font-display);font-style:italic;font-size:19px;color:var(--terre);font-weight:400">À traiter</strong>' +
      '<button onclick="ADM.notifToggle()" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:20px;line-height:1">×</button></div>' +
      '<div style="max-height:60vh;overflow-y:auto">' + commentRows + reworkRows + rows + '</div>';
  }
  function notifToggle() { NOTIF_OPEN = !NOTIF_OPEN; paintNotif(); }
  function notifOpen(key, id) { NOTIF_OPEN = false; paintNotif(); openClient(key); }
  function notifAck(key, id) {
    var it = NEW_TASKS.filter(function (t) { return t.key === key && t.id === id; })[0];
    NEW_TASKS = NEW_TASKS.filter(function (t) { return !(t.key === key && t.id === id); });
    paintNotif();
    if (it && it.kind === 'ticket') api('/api/clients/' + key + '/tickets/' + id, { method: 'PATCH', body: JSON.stringify({ projectId: 'maintenance' }) }).catch(function () {});
    else api('/api/clients/' + key + '/tasks/' + id, { method: 'PATCH', body: JSON.stringify({ projectId: 'partner', clientNotif: false }) }).catch(function () {});
  }
  function notifAckRework(key, id) {
    REWORK_TASKS = REWORK_TASKS.filter(function (t) { return !(t.key === key && t.id === id); });
    paintNotif();
    api('/api/clients/' + key + '/tasks/' + id, { method: 'PATCH', body: JSON.stringify({ projectId: 'partner', needsRework: false }) }).catch(function () {});
  }
  function notifAckComment(key, id) {
    COMMENT_TASKS = COMMENT_TASKS.filter(function (t) { return !(t.key === key && t.id === id); });
    paintNotif();
    api('/api/clients/' + key + '/tasks/' + id, { method: 'PATCH', body: JSON.stringify({ projectId: 'partner', clientCommentNotif: false }) }).catch(function () {});
  }
  function navTimerHtml() {
    var run = MT_TIMER || PT_TIMER || TK_TIMER;
    if (!run) return '';
    var sec = run.base + (Date.now() - run.startedAt) / 1000;
    return '<div style="margin:14px 14px 4px;padding:13px 15px;background:rgba(242,229,194,0.12);border-radius:13px">' +
      '<div style="font-size:10px;letter-spacing:0.09em;text-transform:uppercase;color:var(--paille);opacity:0.65;margin-bottom:5px">Chrono en cours</div>' +
      '<div id="nav-timer-clock" style="font-family:var(--font-micro);font-variant-numeric:tabular-nums;font-weight:700;font-size:23px;color:var(--paille);letter-spacing:0.02em">' + mtClock(sec) + '</div>' +
      '<div style="font-size:12px;color:var(--paille);opacity:0.85;margin:3px 0 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(run.title || 'tâche') + '</div>' +
      '<button class="btn btn--outline btn--block btn--sm" style="color:var(--paille);border-color:rgba(242,229,194,0.3)" onclick="ADM.navTimerPause()">⏸ Mettre en pause</button>' +
    '</div>';
  }
  function refreshNavTimer() { var s = el('nav-timer-slot'); if (s) s.innerHTML = navTimerHtml(); }
  function navTimerPause() { if (MT_TIMER) mtPause(MT_TIMER.id, true); else if (PT_TIMER) ptPause(PT_TIMER.id, true); else if (TK_TIMER) tkPause(TK_TIMER.id, true); refreshNavTimer(); renderMain(); }
  var UNREAD = 0, REV_N = 0, NOTIF_N = 0;
  function refreshTabTitle() { NOTIF_N = UNREAD + REV_N + (typeof notifCount === 'function' ? notifCount() : 0); applyTabTitle(); }
  function refreshUnread() {
    // N'interroge pas le serveur quand l'onglet est masqué : un onglet admin
    // oublié en arrière-plan scannait tous les espaces toutes les 45 s et
    // consommait le quota KV pour rien.
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    api('/api/clients').then(function (r) { return r.json(); }).then(function (d) {
      UNREAD = (d.clients || []).reduce(function (s, c) { return s + (c.unread || 0); }, 0);
      BADGE_CACHE.chat = UNREAD > 0 ? badge(UNREAD) : '';
      BADGE_CACHE.clients = BADGE_CACHE.chat;
      var sigOf = function (list) { return JSON.stringify((list || []).map(function (c) { return [c.key, clientName(c), c.unread || 0, presence(c.lastSeen).online, (c.sections || []).map(function (x) { return x.id + x.label + (x.unread || 0); }).join('|')]; })); };
      var sig = sigOf(d.clients);
      var changed = sig !== sigOf(NAV_CLIENTS);
      NAV_CLIENTS = d.clients || [];
      if (changed) renderNav(); else paintBadges();
      refreshTabTitle();
    }).catch(function () {});
    api('/api/dashboard').then(function (r) { return r.json(); }).then(function (d) {
      REV_N = (d.revisions || []).length;
      // Bulle Priorités : révisions + échéances dépassées ou du jour.
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var urgentDl = (d.deadlines || []).filter(function (x) {
        if (x.status === 'waiting_client' || !x.dueDate) return false;
        var t = new Date(x.dueDate); t.setHours(0, 0, 0, 0);
        return t <= today;
      }).length;
      BADGE_CACHE.priorities = badgeAlert(REV_N + urgentDl);
      var b = el('nav-unread-priorities');
      if (b) b.innerHTML = BADGE_CACHE.priorities;
      NEW_TASKS = d.newTasks || [];
      REWORK_TASKS = d.reworkTasks || [];
      COMMENT_TASKS = d.commentTasks || [];
      var nInbox = inboxUnifiedCount(d);
      BADGE_CACHE.inbox = nInbox > 0 ? badgeAlert(nInbox) : '';
      var bi = el('nav-unread-inbox'); if (bi) bi.innerHTML = BADGE_CACHE.inbox;
      var nErr = d.clientErrorsUnseen || 0;
      BADGE_CACHE.incidents = nErr > 0 ? badgeAlert(nErr) : '';
      var bx = el('nav-unread-incidents'); if (bx) bx.innerHTML = BADGE_CACHE.incidents;
      paintNotif();
      refreshTabTitle();
    }).catch(function () {});
    // Bulle Mes tâches : rouge si des tâches sont en retard ou pour aujourd'hui,
    // sinon compteur discret des tâches à faire.
    api('/api/admin/tasks').then(function (r) { return r.json(); }).then(function (d) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var todo = (d.tasks || []).filter(function (x) { return x.status !== 'done' && !x.archived; });
      var urgent = todo.filter(function (x) { if (!x.dueDate) return false; var t = new Date(x.dueDate); t.setHours(0, 0, 0, 0); return t <= today; }).length;
      BADGE_CACHE.mytasks = urgent > 0 ? badgeAlert(urgent) : (todo.length > 0 ? badge(todo.length) : '');
      var b = el('nav-unread-mytasks');
      if (b) b.innerHTML = BADGE_CACHE.mytasks;
    }).catch(function () {});
  }
  function renderMain() {
    if (VIEW !== 'visios') { var vd = el('vis-drawer'); if (vd) vd.remove(); var vb = el('vis-drawer-bk'); if (vb) vb.remove(); VIS_SEL = null; }
    if (VIEW !== 'questionnaires') { var qd = el('qnr-drawer'); if (qd) qd.remove(); var qb = el('qnr-drawer-bk'); if (qb) qb.remove(); QNR_SEL = null; }
    if (VIEW !== 'projtpl') { var pd = el('prj-drawer'); if (pd) pd.remove(); var pb = el('prj-drawer-bk'); if (pb) pb.remove(); PRJ_SEL = null; }
    if (VIEW === 'inbox') return renderInbox();
    if (VIEW === 'priorities') return renderPriorities();
    if (VIEW === 'done') return renderDone();
    if (VIEW === 'mytasks') return renderMyTasks();
    if (VIEW === 'visios') return renderVisios();
    if (VIEW === 'questionnaires') return renderQuestionnaires();
    if (VIEW === 'projtpl') return renderProjTpl();
    if (VIEW === 'incidents') return renderIncidents();
    if (VIEW === 'kpi') return renderKpi();
    if (VIEW === 'planning') return renderPlanning();
    if (VIEW === 'clients') return renderClients();
    if (VIEW === 'newclient') return renderNewClient();
    if (VIEW === 'client') return renderClient();
    if (VIEW === 'chat') return renderChat();
    if (VIEW === 'avis') return renderAvis();
    if (VIEW === 'reglages') return renderReglages();
  }
  function topbar(title, right, subtitle) {
    return '<div class="topbar"><div class="topbar__head"><h1>' + esc(title) + '</h1>' +
      (subtitle ? '<div class="topbar__sub">' + esc(subtitle) + '</div>' : '') +
      '</div><div class="right">' + (right || '') + '</div></div>';
  }
  function setMain(html) { el('main').innerHTML = html; }

  /* ── Priorités ── */
  function testEmail() {
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="text-align:left">' +
      '<div class="admconfirm__title">Tester l\'envoi d\'e-mail</div>' +
      '<div class="field mt"><label>Adresse de test</label><input class="inp" id="te-to" type="email" placeholder="toi@exemple.fr"></div>' +
      '<div id="te-result" class="micro mt" style="text-transform:none;letter-spacing:0"></div>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Fermer</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Envoyer le test</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var to = (el('te-to').value || '').trim(); if (!to) { toast('Adresse requise'); return; }
      var res = el('te-result'); res.textContent = 'Envoi en cours…';
      jpost('/api/test-email', { to: to }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.ok) { res.style.color = 'var(--green)'; res.textContent = 'Resend OK · e-mail envoyé à ' + to + '.'; toast('Email envoyé ✓'); }
        else { res.style.color = 'var(--red)'; res.textContent = 'Échec Resend · from : ' + (d.from || '(non défini)') + ' · statut ' + d.status + (d.error ? ' · ' + d.error : ''); }
      }).catch(function () { res.style.color = 'var(--red)'; res.textContent = 'Erreur réseau.'; });
    };
    document.body.appendChild(ov);
    var f = el('te-to'); if (f) f.focus();
  }

  /* ── Textes des e-mails (envois volontaires : bilan + relances) ── */
  var EMAIL_TPLS = [];
  function emailsBody() {
    var intro = '<div class="card" style="background:var(--card)">' +
      '<div class="micro" style="text-transform:none;letter-spacing:0;line-height:1.6;color:var(--terre-600)">Ces e-mails ne partent que lorsque tu cliques toi-même (invitation au bilan, relances). Tu peux modifier l\'objet et le message. Les mots entre accolades, comme <code class="emailvar">{prenom}</code>, sont remplacés automatiquement au moment de l\'envoi.</div></div>';
    return intro + EMAIL_TPLS.map(emailCard).join('');
  }
  function emailCard(t) {
    var vars = (t.vars || []).map(function (v) { return '<code class="emailvar">{' + esc(v) + '}</code>'; }).join(' ');
    return '<div class="card infocard" style="background:var(--card)">' +
      '<h3><span class="infocard__dot" style="background:#9c6f18"></span>' + esc(t.label) + '</h3>' +
      '<div class="field"><label>Objet de l\'e-mail</label><input id="em-subj-' + t.key + '" class="inp" value="' + esc(t.subject) + '"></div>' +
      '<div class="field mt"><label>Message</label><textarea id="em-body-' + t.key + '" class="inp" style="min-height:150px">' + esc(t.body) + '</textarea></div>' +
      (vars ? '<div class="micro mt">Variables : ' + vars + '</div>' : '') +
      '<div class="between mt"><button class="btn btn--outline btn--sm" onclick="ADM.emailReset(\'' + t.key + '\')">Rétablir le texte d\'origine</button>' +
      '<button class="btn btn--dark btn--sm" onclick="ADM.emailSave(\'' + t.key + '\')">Enregistrer</button></div></div>';
  }
  function emailFind(k) { for (var i = 0; i < EMAIL_TPLS.length; i++) if (EMAIL_TPLS[i].key === k) return EMAIL_TPLS[i]; return null; }
  function emailPayload() { var p = {}; EMAIL_TPLS.forEach(function (x) { p[x.key] = { subject: x.subject, body: x.body }; }); return p; }
  function emailSave(k) {
    var t = emailFind(k); if (!t) return;
    t.subject = el('em-subj-' + k).value; t.body = el('em-body-' + k).value;
    jpost('/api/email-templates', { templates: emailPayload() }, 'PUT').then(function (r) { if (r.ok) toast('Texte enregistré ✓'); else toast('Erreur'); });
  }
  function emailReset(k) {
    var t = emailFind(k); if (!t) return;
    admConfirm({ title: 'Rétablir le texte d\'origine ?', message: 'Le texte personnalisé de cet e-mail sera remplacé par le texte par défaut.', yes: 'Oui, rétablir', no: 'Non' }, function () {
      t.subject = t.defaultSubject; t.body = t.defaultBody;
      el('em-subj-' + k).value = t.subject; el('em-body-' + k).value = t.body;
      jpost('/api/email-templates', { templates: emailPayload() }, 'PUT').then(function (r) { if (r.ok) toast('Texte rétabli ✓'); else toast('Erreur'); });
    });
  }

  /* ── Réglages : types de mission + textes des e-mails (sections en onglets) ── */
  var MISSION_LIST = [];
  var REGL_TAB = 'types';
  function reglTabs() {
    var items = [['types', 'Types de mission'], ['conges', 'Congés'], ['quick', 'Réponses rapides'], ['emails', 'Textes des e-mails'], ['rdv', 'Rendez-vous'], ['backups', 'Sauvegardes']];
    return '<div class="subtabs">' + items.map(function (it) {
      return '<button class="subtab' + (REGL_TAB === it[0] ? ' active' : '') + '" onclick="ADM.reglSetTab(\'' + it[0] + '\')">' + it[1] + '</button>';
    }).join('') + '</div>';
  }
  function reglSetTab(t) { REGL_TAB = t; renderReglages(); }
  function renderReglages() {
    setMain(topbar('Réglages', '', 'Les paramètres partagés avec l\'espace de tes clients') + '<div class="wrap" style="max-width:820px">' + reglTabs() + '<div id="regl-body"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div></div>');
    if (REGL_TAB === 'emails') {
      api('/api/email-templates').then(function (r) { return r.json(); }).then(function (d) {
        EMAIL_TPLS = d.templates || [];
        var b = el('regl-body'); if (b) b.innerHTML = emailsBody();
      }).catch(function () { var b = el('regl-body'); if (b) b.innerHTML = '<div class="empty">Erreur de chargement.</div>'; });
    } else if (REGL_TAB === 'quick') {
      if (QREPLIES_LOADED) { renderQuickRepliesBody(); }
      else api('/api/quick-replies').then(function (r) { return r.json(); }).then(function (d) { QREPLIES = (d && d.replies) || []; QREPLIES_LOADED = true; renderQuickRepliesBody(); }).catch(function () { var b = el('regl-body'); if (b) b.innerHTML = '<div class="empty">Erreur de chargement.</div>'; });
    } else if (REGL_TAB === 'backups') {
      renderBackups();
    } else if (REGL_TAB === 'conges') {
      api('/api/holidays').then(function (r) { return r.json(); }).then(function (d) {
        HOLIDAYS = Array.isArray(d.holidays) ? d.holidays : [];
        renderCongesBody();
      }).catch(function () { var b = el('regl-body'); if (b) b.innerHTML = '<div class="empty">Erreur de chargement.</div>'; });
    } else if (REGL_TAB === 'rdv') {
      api('/api/booking-link').then(function (r) { return r.json(); }).then(function (d) {
        var b = el('regl-body'); if (!b) return;
        b.innerHTML = '<div class="card infocard" style="background:var(--card)"><h3>Réservation de créneau</h3>' +
          '<div class="micro mb" style="text-transform:none;letter-spacing:0;line-height:1.6;color:var(--terre-600)">Colle ici ton lien Cal.com (ou équivalent). Un bouton « Réserver un créneau » apparaîtra dans l\'espace de tous tes clients. Laisse vide pour le masquer.</div>' +
          '<div class="field"><label>Lien de réservation</label><input class="inp" id="bk-link" value="' + esc(d.link || '') + '" placeholder="https://cal.com/ton-lien"></div>' +
          '<div class="row row--end mt"><button class="btn btn--dark btn--sm" onclick="ADM.bookingSave()">Enregistrer</button></div></div>';
      }).catch(function () { var b = el('regl-body'); if (b) b.innerHTML = '<div class="empty">Erreur de chargement.</div>'; });
    } else {
      api('/api/mission-types').then(function (r) { return r.json(); }).then(function (d) {
        MISSION_LIST = Array.isArray(d.types) ? d.types.slice() : [];
        renderReglagesBody();
      }).catch(showError);
    }
  }
  // ── Réponses rapides : modèles de messages réutilisables ──
  var QREPLIES = [], QREPLIES_LOADED = false;
  function renderQuickRepliesBody() {
    var b = el('regl-body'); if (!b) return;
    var rows = QREPLIES.map(function (r) {
      return '<div class="card" style="padding:14px 16px;margin-bottom:10px;background:var(--card)">' +
        '<div class="row" style="gap:8px;align-items:center;margin-bottom:8px">' +
          '<input class="inp" value="' + esc(r.label || '') + '" placeholder="Titre (ex. Relance douce, Accusé de réception…)" style="flex:1;font-weight:600" onchange="ADM.qrSet(\'' + r.id + '\',\'label\',this.value)">' +
          '<button class="pbtn" style="color:#c44" onclick="ADM.qrDel(\'' + r.id + '\')">Suppr.</button>' +
        '</div>' +
        '<textarea class="inp" placeholder="Le texte du message…" style="width:100%;box-sizing:border-box;min-height:80px;resize:vertical;font-size:14px;line-height:1.5" onchange="ADM.qrSet(\'' + r.id + '\',\'text\',this.value)">' + esc(r.text || '') + '</textarea>' +
      '</div>';
    }).join('');
    b.innerHTML = '<div class="card infocard" style="background:var(--card)"><h3>Réponses rapides</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;line-height:1.6;color:var(--terre-600)">Tes messages récurrents, prêts à insérer en un clic depuis la messagerie (bouton ⚡). Ils ne sont visibles que par toi.</div>' +
      (rows || '<div class="empty" style="margin-bottom:10px">Aucune réponse rapide. Crée ton premier modèle (ex. « Accusé de réception », « Relance douce »).</div>') +
      '<button class="btn btn--outline btn--sm" style="margin-top:4px" onclick="ADM.qrAdd()">+ Ajouter une réponse</button></div>';
  }
  function qrSave() { jpost('/api/quick-replies', { replies: QREPLIES }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement'); }).catch(function () { toast('Erreur'); }); }
  function qrAdd() { QREPLIES.push({ id: 'qr' + Date.now().toString(36), label: '', text: '' }); qrSave(); renderQuickRepliesBody(); }
  function qrSet(id, field, val) { QREPLIES.forEach(function (r) { if (r.id === id) r[field] = val; }); qrSave(); }
  function qrDel(id) { QREPLIES = QREPLIES.filter(function (r) { return r.id !== id; }); qrSave(); renderQuickRepliesBody(); }
  // Sélecteur d'insertion depuis un composeur (msg-<pid> ou gmsg).
  function qrPick(targetId) {
    var open = function () {
      if (!QREPLIES.length) { toast('Aucune réponse rapide — ajoute-en dans Réglages ▸ Réponses rapides.'); return; }
      var ov = document.createElement('div'); ov.className = 'admconfirm';
      ov.innerHTML = '<div class="admconfirm__box" style="max-width:520px;text-align:left">' +
        '<div class="admconfirm__title">Insérer une réponse rapide</div>' +
        '<div style="max-height:340px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;margin:8px 0">' +
          QREPLIES.map(function (r, i) {
            return '<button class="qr-pick" data-i="' + i + '" style="text-align:left;padding:11px 13px;border:1px solid var(--bone-d);border-radius:10px;background:var(--card);cursor:pointer">' +
              '<div style="font-weight:600;font-size:13.5px;color:var(--terre)">' + esc(r.label || '(sans titre)') + '</div>' +
              '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px">' + esc((r.text || '').slice(0, 90)) + '</div>' +
            '</button>';
          }).join('') +
        '</div>' +
        '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Fermer</button></div></div>';
      function close() { ov.remove(); }
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      ov.querySelector('[data-no]').onclick = close;
      ov.querySelectorAll('.qr-pick').forEach(function (btn) {
        btn.onclick = function () {
          var r = QREPLIES[parseInt(btn.getAttribute('data-i'), 10)];
          var ta = el(targetId);
          if (ta && r) { var cur = ta.value || ''; ta.value = cur.trim() ? (cur.replace(/\s*$/, '') + '\n\n' + r.text) : r.text; if (typeof taGrow === 'function') taGrow(ta); ta.focus(); }
          close();
        };
      });
      document.body.appendChild(ov);
    };
    if (QREPLIES_LOADED) open();
    else api('/api/quick-replies').then(function (r) { return r.json(); }).then(function (d) { QREPLIES = (d && d.replies) || []; QREPLIES_LOADED = true; open(); }).catch(function () { toast('Erreur'); });
  }

  function renderBackups() {
    api('/api/backups').then(function (r) { return r.json(); }).then(function (d) {
      var b = el('regl-body'); if (!b) return;
      var rows = (d.backups || []).map(function (x) {
        var dt = x.name.replace('.json', '').replace('T', ' à ').replace('h', ':');
        var mb = (x.size / 1024).toFixed(0) + ' Ko';
        return '<div class="file" style="gap:10px"><span class="nm">' + esc(dt) + ' <span class="micro" style="color:var(--muted)">· ' + mb + '</span></span>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.backupDownload(\'' + esc(x.name) + '\')">Télécharger</button>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.backupRestoreOpen(\'' + esc(x.name) + '\')">Restaurer…</button></div>';
      }).join('');
      b.innerHTML = '<div class="card infocard" style="background:var(--card)"><h3>Sauvegardes</h3>' +
        '<div class="micro mb" style="text-transform:none;letter-spacing:0;line-height:1.6;color:var(--terre-600)">Une sauvegarde complète (espaces clients, tes tâches, planning, réglages) est créée automatiquement chaque semaine et conservée 2 semaines. Les fichiers déposés vivent déjà dans un stockage durable et ne sont pas dupliqués. Tu peux aussi créer une sauvegarde à la demande, la télécharger sur ton ordinateur, ou restaurer un client depuis un instantané.</div>' +
        '<div class="row mb"><button class="btn btn--dark btn--sm" onclick="ADM.backupRun()">Créer une sauvegarde maintenant</button></div>' +
        (rows || '<div class="empty">Aucune sauvegarde pour le moment. La première se créera cette nuit, ou clique ci-dessus.</div>') + '</div>';
    }).catch(function () { var b = el('regl-body'); if (b) b.innerHTML = '<div class="empty">Erreur de chargement.</div>'; });
  }
  function backupRun() {
    toast('Sauvegarde en cours…');
    jpost('/api/backups', {}).then(function (r) { return r.json(); }).then(function (d) {
      if (d.ok) { toast('Sauvegarde créée ✓ (' + d.clients + ' client' + (d.clients > 1 ? 's' : '') + ')'); renderBackups(); }
      else toast(d.error || 'Erreur');
    }).catch(function () { toast('Erreur'); });
  }
  function backupDownload(name) {
    api('/api/backups/download?name=' + encodeURIComponent(name)).then(function (r) { if (!r.ok) throw new Error(); return r.blob(); }).then(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'seedtobloom-sauvegarde-' + name;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    }).catch(function () { toast('Erreur de téléchargement'); });
  }
  function backupRestoreOpen(name) {
    var opts = '<option value="admin:tasks">Mes tâches (perso)</option>' + NAV_CLIENTS.map(function (c) { return '<option value="' + esc(c.key) + '">' + esc(clientName(c)) + '</option>'; }).join('');
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="text-align:left">' +
      '<div class="admconfirm__title">Restaurer depuis « ' + esc(name.replace('.json', '')) + ' »</div>' +
      '<div class="admconfirm__msg">Choisis ce qu\'il faut restaurer. Les données actuelles de la cible seront remplacées par celles de la sauvegarde.</div>' +
      '<div class="field mt"><label>Restaurer</label><select class="inp" id="bk-target">' + opts + '</select></div>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:#b5462f;color:#fff;border-color:#b5462f">Restaurer</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var target = el('bk-target').value; close();
      admConfirm({ title: 'Dernière confirmation', message: 'Les données actuelles seront écrasées par la sauvegarde. Continuer ?', yes: 'Oui, restaurer', no: 'Non', danger: true }, function () {
        jpost('/api/backups/restore', { name: name, target: target }).then(function (r) { return r.json(); }).then(function (d) {
          if (d.ok) toast('Restauré : ' + d.restored + ' ✓'); else toast(d.error || 'Erreur');
        }).catch(function () { toast('Erreur'); });
      });
    };
    document.body.appendChild(ov);
  }
  function bookingSave() {
    jpost('/api/booking-link', { link: (el('bk-link').value || '').trim() }, 'PUT').then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) toast(res.d.link ? 'Lien enregistré — bouton visible chez tes clients ✓' : 'Lien retiré, bouton masqué'); else toast((res.d && res.d.error) || 'Erreur'); })
      .catch(function () { toast('Erreur'); });
  }
  /* ── Congés du studio ── */
  var HOLIDAYS = [];
  function congesReadInputs() {
    return HOLIDAYS.map(function (_, i) {
      return { id: HOLIDAYS[i] && HOLIDAYS[i].id || '', from: (el('cg-from-' + i) || {}).value || '', to: (el('cg-to-' + i) || {}).value || '', message: (el('cg-msg-' + i) || {}).value || '' };
    });
  }
  function renderCongesBody() {
    var b = el('regl-body'); if (!b) return;
    var rows = HOLIDAYS.map(function (h, i) {
      return '<div style="border:1px solid var(--bone-d);border-radius:12px;padding:12px 14px;margin-bottom:10px">' +
        '<div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">' +
          '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">Du <input class="inp" type="date" id="cg-from-' + i + '" value="' + esc(h.from || '') + '" style="width:auto"></label>' +
          '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">au <input class="inp" type="date" id="cg-to-' + i + '" value="' + esc(h.to || '') + '" style="width:auto"></label>' +
          '<button class="btn btn--danger btn--sm" style="margin-left:auto" onclick="ADM.congesDel(' + i + ')" title="Retirer">✕</button>' +
        '</div>' +
        '<input class="inp mt" id="cg-msg-' + i + '" value="' + esc(h.message || '') + '" placeholder="Message affiché au client (ex. Je serai en congés, réponses à mon retour)" style="width:100%;box-sizing:border-box">' +
      '</div>';
    }).join('');
    b.innerHTML = '<div class="card infocard" style="background:var(--card)"><h3>Congés du studio</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;line-height:1.6;color:var(--terre-600)">Ajoute tes périodes de congés. Un bandeau s\'affiche en haut de l\'espace de <b>tous tes clients</b> pendant la période (et jusqu\'à 30 jours avant, en « À venir »). Laisse le message vide pour un texte par défaut.</div>' +
      (rows || '<div class="empty">Aucun congé programmé.</div>') +
      '<div class="row mt" style="gap:8px"><button class="btn btn--outline btn--sm" onclick="ADM.congesAdd()">+ Ajouter une période</button>' +
        '<button class="btn btn--dark btn--sm" style="margin-left:auto" onclick="ADM.congesSave()">Enregistrer</button></div></div>';
  }
  function congesAdd() { HOLIDAYS = congesReadInputs(); HOLIDAYS.push({ id: '', from: '', to: '', message: '' }); renderCongesBody(); }
  function congesDel(i) { HOLIDAYS = congesReadInputs(); HOLIDAYS.splice(i, 1); renderCongesBody(); }
  function congesSave() {
    var list = congesReadInputs().filter(function (h) { return h.from; });
    jpost('/api/holidays', { holidays: list }, 'PUT').then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) { HOLIDAYS = res.d.holidays || []; toast('Congés enregistrés ✓'); renderCongesBody(); } else toast((res.d && res.d.error) || 'Erreur'); })
      .catch(function () { toast('Erreur'); });
  }
  function missionReadInputs() { return MISSION_LIST.map(function (_, i) { var e = el('mt-type-' + i); return e ? e.value : MISSION_LIST[i]; }); }
  function missionBody() {
    var rows = MISSION_LIST.map(function (t, i) {
      return '<div class="row" style="gap:8px;margin-bottom:8px"><input class="inp" id="mt-type-' + i + '" value="' + esc(t) + '" style="flex:1"><button class="btn btn--danger btn--sm" onclick="ADM.missionTypeDel(' + i + ')" title="Retirer">✕</button></div>';
    }).join('');
    return '<div class="card infocard" style="background:var(--card)"><h3>Types de mission</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;line-height:1.6;color:var(--terre-600)">Ces catégories sont proposées au client quand il crée une tâche, et servent au suivi du temps par type. Modifie, ajoute ou retire selon tes besoins, puis enregistre.</div>' +
      (rows || '<div class="empty">Aucun type. Ajoutez-en un ci-dessous.</div>') +
      '<div class="row mt" style="gap:8px"><input class="inp" id="mt-type-new" placeholder="Nouveau type de mission" style="flex:1" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.missionTypeAdd();}"><button class="btn btn--outline btn--sm" onclick="ADM.missionTypeAdd()">+ Ajouter</button></div>' +
      '<div class="row row--end mt"><button class="btn btn--dark btn--sm" onclick="ADM.missionTypeSave()">Enregistrer</button></div></div>';
  }
  function renderReglagesBody() { var b = el('regl-body'); if (b) b.innerHTML = missionBody(); }
  function missionTypeAdd() {
    MISSION_LIST = missionReadInputs();
    var nv = (el('mt-type-new').value || '').trim();
    if (nv) MISSION_LIST.push(nv);
    renderReglagesBody();
  }
  function missionTypeDel(i) {
    MISSION_LIST = missionReadInputs();
    MISSION_LIST.splice(i, 1);
    renderReglagesBody();
  }
  function missionTypeSave() {
    var list = missionReadInputs().map(function (s) { return (s || '').trim(); }).filter(Boolean);
    if (!list.length) { toast('La liste ne peut pas être vide'); return; }
    jpost('/api/mission-types', { types: list }, 'PUT').then(function (r) { if (r.ok) { toast('Types de mission enregistrés ✓'); MISSION_LIST = list; renderReglagesBody(); } else toast('Erreur'); });
  }
  var PRIO_GROUP = 'date', PRIO_FILTER = 'all', PRIO_D = null, PRIO_TAB = 'todo';
  function prioSetGroup(v) { PRIO_GROUP = v; if (PRIO_D) renderPrioBody(PRIO_D); }
  function prioSetFilter(v) { PRIO_FILTER = v; if (PRIO_D) renderPrioBody(PRIO_D); }
  function prioSetTab(v) { PRIO_TAB = v; if (PRIO_D) renderPrioBody(PRIO_D); }
  function capSave(v) {
    var n = Math.max(0, parseFloat(v) || 0);
    jpost('/api/capacity', { weeklyHours: n }, 'PATCH').then(function (r) {
      if (r.ok) { if (PRIO_D) { PRIO_D.weeklyCapacity = n; renderPrioBody(PRIO_D); } toast('Capacité enregistrée ✓'); }
      else toast('Erreur');
    }).catch(function () { toast('Erreur'); });
  }
  /* ── Inbox unifiée : tout ce qui arrive des clientes, dans un seul flux ──
   * Demandes à trier, questionnaires complétés, nouvelles tâches/tickets,
   * retours reçus, nouveaux commentaires, livrables validés. « Traité → ça
   * disparaît » : chaque action retire l'élément et libère le badge. */
  var INBOX_D = null;
  // Icône (DA) + teintes par type d'événement.
  var INBOX_TYPES = {
    demande:   { icon: 'inbox',          label: 'Nouvelle demande',       ic: '#a35a1a', bg: '#fdf3e8' },
    qnr:       { icon: 'questionnaires',  label: 'Questionnaire complété',  ic: '#3f6a7a', bg: '#edf3f6' },
    task:      { icon: 'stepClient',      label: 'Nouvelle tâche',         ic: '#8a6f2e', bg: '#fbf5e6' },
    ticket:    { icon: 'maint',           label: 'Ticket de maintenance',  ic: '#8a6f2e', bg: '#fbf5e6' },
    rework:    { icon: 'stepStudio',      label: 'Retours reçus',          ic: '#3f5a37', bg: '#f3f6f0' },
    comment:   { icon: 'chat',            label: 'Nouveau commentaire',    ic: '#6c4ea4', bg: '#f4f1fa' },
    validated: { icon: 'stepValid',       label: 'Livrable validé',        ic: '#2f8f57', bg: '#edf6ef' }
  };
  function renderInbox() {
    setMain(topbar('Inbox', '', 'Tout ce qui arrive de tes clientes — traite, et ça disparaît') + '<div class="wrap" id="inbox-body"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/dashboard').then(function (r) { return r.json(); }).then(function (d) { INBOX_D = d; renderInboxBody(); }).catch(showError);
  }
  function fmtMin(m) { m = Math.round(m || 0); if (m < 60) return m + ' min'; var h = Math.floor(m / 60), r = m % 60; return h + ' h' + (r ? ' ' + r : ''); }
  // Liste unifiée, du plus récent au plus ancien.
  function inboxItems() {
    var d = INBOX_D || {}, items = [];
    (d.inbox || []).forEach(function (x) { items.push({ type: 'demande', at: x.createdAt, x: x }); });
    (d.qnrDone || []).forEach(function (x) { items.push({ type: 'qnr', at: x.completedAt, x: x }); });
    (d.newTasks || []).forEach(function (x) { items.push({ type: x.kind === 'ticket' ? 'ticket' : 'task', at: x.createdAt, x: x }); });
    (d.reworkTasks || []).forEach(function (x) { items.push({ type: 'rework', at: x.at, x: x }); });
    (d.commentTasks || []).forEach(function (x) { items.push({ type: 'comment', at: x.at, x: x }); });
    (d.validated || []).forEach(function (x) { items.push({ type: 'validated', at: x.at, x: x }); });
    items.sort(function (a, b) { return String(b.at || '').localeCompare(String(a.at || '')); });
    return items;
  }
  function inboxUnifiedCount(d) {
    d = d || INBOX_D || {};
    return (d.inbox || []).length + (d.qnrDone || []).length + (d.newTasks || []).length + (d.reworkTasks || []).length + (d.commentTasks || []).length + (d.validated || []).length;
  }
  function renderInboxBody() {
    var b = el('inbox-body'); if (!b) return;
    var items = inboxItems();
    if (!items.length) { b.innerHTML = '<div class="card infocard" style="background:var(--card);max-width:720px"><div class="empty" style="padding:34px 20px">🌾 Boîte vide — tout est traité.<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:8px">Les demandes, questionnaires, retours, commentaires et validations de tes clientes arriveront ici.</div></div></div>'; return; }
    var today = new Date(); today.setHours(0, 0, 0, 0);
    function bucket(at) { if (!at) return 'Plus tôt'; var t = new Date(at); if (isNaN(t)) return 'Plus tôt'; t.setHours(0, 0, 0, 0); var diff = Math.round((today - t) / 86400000); if (diff <= 0) return "Aujourd'hui"; if (diff === 1) return 'Hier'; if (diff <= 7) return 'Cette semaine'; return 'Plus tôt'; }
    var order = ["Aujourd'hui", 'Hier', 'Cette semaine', 'Plus tôt'], groups = {};
    items.forEach(function (it) { var k = bucket(it.at); (groups[k] = groups[k] || []).push(it); });
    var html = '';
    order.forEach(function (g) {
      if (!groups[g]) return;
      html += '<div class="micro" style="text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin:18px 2px 8px;font-weight:600">' + g + ' · ' + groups[g].length + '</div>' + groups[g].map(inboxCard).join('');
    });
    b.innerHTML = '<div style="max-width:720px">' + html + '</div>';
  }
  // Coquille commune : pastille icône + type + cliente + date, puis corps + actions.
  function inboxChrome(it, bodyHtml, actionsHtml, accent) {
    var cfg = INBOX_TYPES[it.type] || INBOX_TYPES.task, x = it.x;
    var w = it.at ? new Date(it.at) : null;
    var whenTxt = w && !isNaN(w) ? w.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '';
    var chip = '<span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:11px;background:' + cfg.bg + ';color:' + cfg.ic + ';flex-shrink:0">' + admIcon(cfg.icon) + '</span>';
    return '<div class="card" style="background:var(--card);padding:15px 17px;margin-bottom:11px;border:1px solid var(--bone-d)' + (accent ? ';border-left:3px solid ' + accent : '') + '">' +
      '<div style="display:flex;gap:12px;align-items:flex-start">' + chip +
        '<div style="min-width:0;flex:1">' +
          '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">' +
            '<span class="micro" style="text-transform:uppercase;letter-spacing:0.05em;font-weight:700;color:' + cfg.ic + '">' + cfg.label + '</span>' +
            (whenTxt ? '<span class="micro" style="color:var(--muted);flex-shrink:0;text-transform:none;letter-spacing:0">' + whenTxt + '</span>' : '') +
          '</div>' +
          '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--glycine-900);margin-top:2px"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a></div>' +
          bodyHtml +
          (actionsHtml ? '<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:12px">' + actionsHtml + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }
  function inboxPreview(content) {
    var c = (content || '').trim();
    return c ? '<div style="font-size:12.5px;color:var(--terre-600);line-height:1.5;margin-top:5px;white-space:pre-wrap;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">' + mtLinkify(c) + '</div>' : '';
  }
  function inboxAtts(x) {
    var atts = Array.isArray(x.attachments) ? x.attachments : [];
    if (!atts.length) return '';
    return '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px">' + atts.map(function (a) {
      return '<a href="/api/clients/' + x.key + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;font-size:11.5px;padding:4px 9px;border-radius:8px;border:1px solid var(--bone-d);color:var(--glycine-900);text-decoration:none">📎 ' + esc(a.name || 'fichier') + '</a>';
    }).join('') + '</div>';
  }
  function inboxCard(it) {
    if (it.type === 'demande') return inboxDemandeCard(it);
    var x = it.x;
    var openBtn = '<button class="btn btn--dark btn--sm" onclick="ADM.openClient(\'' + x.key + '\')">Ouvrir la fiche</button>';
    var seenArgs = '\'' + it.type + '\',\'' + x.key + '\',\'' + x.id + '\'' + (it.type === 'validated' ? ',\'' + (x.project || 'partner') + '\'' : '');
    var seenBtn = '<button class="btn btn--outline btn--sm" onclick="ADM.inboxSeen(' + seenArgs + ')">Vu</button>';
    var body = '';
    if (it.type === 'qnr') {
      body = '<div style="font-size:14px;font-weight:600;color:var(--terre);margin-top:6px">' + esc(x.name || 'Questionnaire') + '</div>';
    } else if (it.type === 'task' || it.type === 'ticket') {
      body = '<div style="font-size:14.5px;font-weight:600;color:var(--terre);margin-top:5px">' + esc(x.title || 'Sans titre') + '</div>' + inboxPreview(x.content) + inboxAtts(x);
    } else if (it.type === 'rework') {
      body = '<div style="font-size:14.5px;font-weight:600;color:var(--terre);margin-top:5px">' + esc(x.title || 'Sans titre') + '</div><div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:4px">La cliente a laissé ses retours · à retravailler de ton côté.</div>';
    } else if (it.type === 'comment') {
      body = '<div style="font-size:14.5px;font-weight:600;color:var(--terre);margin-top:5px">' + esc(x.title || 'Sans titre') + '</div>' + (x.text ? '<div style="font-size:12.5px;color:var(--terre-600);line-height:1.5;margin-top:5px;font-style:italic;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">« ' + esc(x.text) + ' »</div>' : '');
    } else if (it.type === 'validated') {
      body = '<div style="font-size:14.5px;font-weight:600;color:var(--terre);margin-top:5px">' + esc(x.name || 'Livrable') + '</div>' + (x.taskTitle ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:3px">Tâche : ' + esc(x.taskTitle) + '</div>' : '');
    }
    return inboxChrome(it, body, openBtn + seenBtn);
  }
  function inboxDemandeCard(it) {
    var x = it.x;
    var urg = x.urgency === 'haute' || x.urgency === 'urgent';
    var isProject = x.demandeType === 'project';
    var projBadge = isProject ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#7a3a0a;background:#fdf3e8;padding:3px 8px;border-radius:999px;vertical-align:middle">🟠 Nouveau projet · devis</span>' : '';
    var urgBadge = urg ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#9b3a2e;background:#fbeae5;padding:3px 8px;border-radius:999px;vertical-align:middle">Urgent</span>' : '';
    var forfaitTxt = x.forfaitConfigured ? (x.forfaitRemaining <= 0 ? 'forfait épuisé' : 'reste ' + x.forfaitRemaining + ' h') : 'forfait non défini';
    var forfaitCol = x.forfaitConfigured && x.forfaitRemaining <= 0 ? 'var(--red)' : (x.forfaitConfigured && x.forfaitRemaining <= 2 ? 'var(--orange)' : 'var(--muted)');
    var atts = (x.attachments || []).map(function (a) { return '<a class="btn btn--outline btn--sm" href="/api/clients/' + x.key + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank">📎 ' + esc(a.name || 'fichier') + '</a>'; }).join('');
    var link = x.clientLink ? '<a class="btn btn--outline btn--sm" href="' + esc(/^https?:\/\//i.test(x.clientLink) ? x.clientLink : 'https://' + x.clientLink) + '" target="_blank" rel="noopener">🔗 Lien</a>' : '';
    var body =
      '<div style="font-size:16px;font-weight:650;color:var(--terre);margin-top:5px">' + esc(x.title || 'Sans titre') + urgBadge + projBadge +
        '<span style="float:right;font-family:var(--font-micro);font-size:11px;font-weight:600;color:' + forfaitCol + '">' + esc(forfaitTxt) + '</span>' +
      '</div>' +
      ((Array.isArray(x.blocks) && x.blocks.length)
        ? ptBlocksHtml(x, x.key, 'La demande du client')
        : (x.content ? '<div style="font-size:14px;color:var(--terre-600);line-height:1.5;margin-top:10px;white-space:pre-wrap">' + mtLinkify(x.content) + '</div>' : '')) +
      briefTableHtml(x.table) +
      '<div class="row" style="gap:14px;flex-wrap:wrap;margin-top:12px;font-family:var(--font-micro);font-size:11px;color:var(--muted)">' +
        (x.dueDate ? '<span>📅 Souhaité : <strong style="color:var(--terre)">' + esc((x.dueDate || '').split('-').reverse().join('/')) + '</strong></span>' : '') +
        '<span>📨 ' + x.monthCount + ' demande' + (x.monthCount > 1 ? 's' : '') + ' ce mois</span>' +
        (x.avgMinutes ? '<span>⏱ Temps moyen : ' + fmtMin(x.avgMinutes) + '</span>' : '') +
      '</div>' +
      ((atts || link) ? '<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:10px">' + atts + link + '</div>' : '');
    var actions =
      '<button class="btn btn--dark btn--sm" onclick="ADM.inboxTriage(\'' + x.key + '\',\'' + x.id + '\',\'accept\')">✓ Accepter → tâche</button>' +
      '<button class="btn btn--outline btn--sm" onclick="ADM.inboxTriage(\'' + x.key + '\',\'' + x.id + '\',\'hors_forfait\')">Hors forfait</button>' +
      '<button class="btn btn--outline btn--sm" style="margin-left:auto;color:#c44" onclick="ADM.inboxTriage(\'' + x.key + '\',\'' + x.id + '\',\'refuse\')">Refuser</button>' +
      '<button class="pbtn" onclick="ADM.openClient(\'' + x.key + '\')">Ouvrir la fiche</button>';
    return inboxChrome(it, body, actions, urg ? '#a23c28' : '');
  }
  // Retire l'élément de toutes les listes et rafraîchit le badge de nav.
  function inboxDrop(key, id) {
    if (!INBOX_D) return;
    ['inbox', 'qnrDone', 'newTasks', 'reworkTasks', 'commentTasks', 'validated'].forEach(function (k) {
      if (Array.isArray(INBOX_D[k])) INBOX_D[k] = INBOX_D[k].filter(function (x) { return !(x.key === key && x.id === id); });
    });
    renderInboxBody();
    var n = inboxUnifiedCount(); BADGE_CACHE.inbox = n > 0 ? badgeAlert(n) : '';
    var bi = el('nav-unread-inbox'); if (bi) bi.innerHTML = BADGE_CACHE.inbox;
  }
  function inboxSeen(type, key, id, project) {
    inboxDrop(key, id);
    var url, body;
    if (type === 'qnr') { url = '/api/clients/' + key + '/questionnaires/' + id; body = { seenByAdmin: true }; }
    else if (type === 'ticket') { url = '/api/clients/' + key + '/tickets/' + id; body = { projectId: 'maintenance' }; }
    else if (type === 'rework') { url = '/api/clients/' + key + '/tasks/' + id; body = { projectId: 'partner', needsRework: false }; }
    else if (type === 'comment') { url = '/api/clients/' + key + '/tasks/' + id; body = { projectId: 'partner', clientCommentNotif: false }; }
    else if (type === 'validated') { url = '/api/clients/' + key + '/deliverables/' + id; body = { projectId: project || 'partner', seenByAdmin: true }; }
    else { url = '/api/clients/' + key + '/tasks/' + id; body = { projectId: 'partner', clientNotif: false }; }
    jpost(url, body, 'PATCH').catch(function () {});
    toast('Traité ✓');
  }
  function inboxTriage(key, id, action) {
    var labels = { accept: 'Accepter cette demande et en faire une tâche planifiée ?', hors_forfait: 'Marquer comme hors forfait (la cliente sera prévenue que ça nécessite un devis) ?', refuse: 'Refuser et archiver cette demande ?' };
    var doIt = function (notify) {
      jpost('/api/clients/' + key + '/tasks/' + id, { projectId: 'partner', triage: action, notify: notify }, 'PATCH').then(function (r) {
        if (r.ok) {
          inboxDrop(key, id);
          toast(action === 'accept' ? 'Demande acceptée → tâche' : (action === 'hors_forfait' ? 'Marquée hors forfait' : 'Demande refusée'));
        } else toast('Erreur');
      }).catch(function () { toast('Erreur'); });
    };
    if (action === 'refuse') { doIt(false); return; }
    notifyConfirm(labels[action], function (notify) { doIt(notify); });
  }

  function renderPriorities() {
    setMain(topbar('Priorités', '<button class="btn btn--outline btn--sm" onclick="ADM.testEmail()">Tester l\'email</button>') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/dashboard').then(function (r) { return r.json(); }).then(function (d) { PRIO_D = d; renderPrioBody(d); }).catch(showError);
  }
  // Rafraîchissement « silencieux » après une action réussie (envoi de livrable…) :
  // ne remplace jamais l'écran par une erreur pleine page si le rechargement
  // échoue — l'action a réussi, on garde l'écran et on réessaiera au besoin.
  function refreshPriorities() {
    api('/api/dashboard').then(function (r) { return r.json(); }).then(function (d) { PRIO_D = d; if (VIEW === 'priorities') renderPrioBody(d); }).catch(function () { });
  }
  function renderPrioBody(d) {
      var right = '<button class="btn btn--outline btn--sm" onclick="ADM.testEmail()">Tester l\'email</button>';
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var SL = { todo: 'À faire', in_progress: 'En cours', review: 'À valider', waiting_client: 'Attente client', upcoming: 'À venir', done: 'Terminé' };
      function ddiff(s) { var t = new Date(s); t.setHours(0, 0, 0, 0); return Math.round((t - today) / 86400000); }
      function whenLabel(n) { return n < 0 ? ((-n) + ' j de retard') : n === 0 ? "aujourd'hui" : n === 1 ? 'demain' : ('dans ' + n + ' j'); }
      function whenCol(n) { return n < 0 ? 'var(--red)' : n === 0 ? 'var(--orange)' : 'var(--muted)'; }

      var all = (d.deadlines || []).map(function (x) { x._d = x.dueDate ? ddiff(x.dueDate) : 99; return x; });
      // Les tâches « à valider » (review) attendent la révision du client :
      // elles quittent « À faire » et rejoignent « Attente client ».
      var reviewWait = all.filter(function (x) { return x.status === 'review'; });
      var mine = all.filter(function (x) { return x.status !== 'waiting_client' && x.status !== 'review'; });
      var waiting = all.filter(function (x) { return x.status === 'waiting_client'; });
      var pv = d.pendingValidation || [];

      var nLate = mine.filter(function (x) { return x._d < 0; }).length;
      var nToday = mine.filter(function (x) { return x._d === 0; }).length;
      var nWeek = mine.filter(function (x) { return x._d > 0 && x._d <= 7; }).length;
      var nWait = waiting.length + pv.length + reviewWait.length;

      function kpi(cls, n, l, tab) { return '<div class="kpi ' + cls + (n > 0 ? ' is-on' : '') + (tab ? ' kpi--clic' : '') + '"' + (tab ? ' onclick="ADM.prioSetTab(\'' + tab + '\')"' : '') + '><div class="kpi__n">' + n + '</div><div class="kpi__l">' + l + '</div></div>'; }
      var kpis = '<div class="kpis">' + kpi('kpi--late', nLate, 'En retard', 'todo') + kpi('kpi--today', nToday, "Aujourd'hui", 'todo') + kpi('kpi--week', nWeek, 'Cette semaine', 'todo') + kpi('kpi--wait', nWait, 'Attente client', 'waiting') + '</div>';

      // Aperçu dépliable du contenu de la tâche (demande du client + pièces jointes),
      // pour consulter « ce qu'il y a dedans » sans quitter la page Priorités.
      // Lien déposé par le client sur sa tâche, affiché en clair dans la ligne.
      function prioClientLink(x, dark) {
        var l = (x.clientLink || '').trim();
        if (!l) return '';
        var u = /^https?:\/\//i.test(l) ? l : 'https://' + l;
        return '<div style="margin-top:4px;font-size:12.5px;display:flex;align-items:center;gap:6px"><span style="flex-shrink:0;opacity:0.6">🔗</span><a href="' + esc(u) + '" target="_blank" rel="noopener" style="color:' + (dark ? 'rgba(242,229,194,0.95)' : 'var(--glycine-900)') + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="Lien déposé par le client">' + esc(l.replace(/^https?:\/\//i, '').slice(0, 60)) + '</a></div>';
      }
      function prioBrief(x, dark) {
        var c = (x.content || '').trim();
        var hasBlocks = Array.isArray(x.blocks) && x.blocks.length;
        var hasTable = x.table && Array.isArray(x.table.cols) && x.table.cols.length;
        if (!c && !hasBlocks && !hasTable && !x.attCount) return '';
        var txtCol = dark ? 'rgba(242,229,194,0.82)' : 'var(--terre-600)';
        var mutCol = dark ? 'rgba(242,229,194,0.6)' : 'var(--muted)';
        var sumCol = dark ? 'rgba(242,229,194,0.7)' : 'var(--glycine-900)';
        var body = (hasBlocks || hasTable)
          ? '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:10px;padding:8px 13px;margin-top:8px">' + ptBlocksHtml(x, x.key, 'Le brief du client') + briefTableHtml(x.table) + '</div>'
          : (c
            ? '<div style="white-space:pre-wrap;font-size:13px;line-height:1.55;color:' + txtCol + ';margin-top:7px">' + mtLinkify(c) + '</div>'
            : '<div style="margin-top:7px;font-size:12.5px;font-style:italic;color:' + mutCol + '">Aucune description ajoutée par le client.</div>');
        var atts = Array.isArray(x.attachments) ? x.attachments : [];
        var att = atts.length
          ? '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px">' + atts.map(function (a) {
              return '<a href="/api/clients/' + x.key + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:5px 10px;border-radius:8px;border:1px solid ' + (dark ? 'rgba(242,229,194,0.25)' : 'var(--bone-d)') + ';color:' + (dark ? 'rgba(242,229,194,0.9)' : 'var(--glycine-900)') + ';text-decoration:none">📎 ' + esc(a.name || 'fichier') + '</a>';
            }).join('') + '</div>'
          : (x.attCount ? '<div style="margin-top:7px;font-size:12px;color:' + mutCol + '">📎 ' + x.attCount + ' fichier' + (x.attCount > 1 ? 's' : '') + ' joint' + (x.attCount > 1 ? 's' : '') + '</div>' : '');
        return '<details style="margin-top:7px"><summary style="cursor:pointer;list-style:none;font-family:var(--font-micro);font-size:10px;letter-spacing:0.05em;text-transform:uppercase;color:' + sumCol + '">Voir la demande</summary>' + body + att + '</details>';
      }
      // Chrono par tâche partenaire, utilisable directement depuis Priorités
      // (Démarrer/Pause), avec le temps déjà passé. Le temps est aussi visible
      // par le client sur son espace.
      function prioTimer(x, dark) {
        if (!x.id) return '';
        // Tickets : saisie manuelle du temps passé (pas de chrono live inter-clients ici).
        if (x.kind === 'ticket' || x.project === 'maintenance') {
          var tsec = x.timeSpentSeconds || (x.timeSpentMinutes || 0) * 60;
          var tcol = dark ? 'rgba(242,229,194,0.85)' : 'var(--terre)';
          var tclock = '<span title="Temps passé sur ce ticket" style="font-family:var(--font-micro);font-variant-numeric:tabular-nums;font-weight:700;font-size:13px;color:' + tcol + ';min-width:54px;text-align:right">' + mtClock(tsec) + '</span>';
          var tedit = '<button class="pbtn" title="Saisir le temps passé sur ce ticket" onclick="ADM.prioSetTime(\'' + x.key + '\',\'' + x.id + '\',' + tsec + ',\'ticket\',\'' + (x.project || 'maintenance') + '\')">✎</button>';
          return '<span style="display:inline-flex;align-items:center;gap:5px">' + tclock + tedit + '</span>';
        }
        if (x.project !== 'partner') return '';
        var run = PT_TIMER && PT_TIMER.id === x.id;
        var sec = run ? (PT_TIMER.base + (Date.now() - PT_TIMER.startedAt) / 1000) : (x.timeSpentSeconds || 0);
        var col = run ? 'var(--green)' : (dark ? 'rgba(242,229,194,0.85)' : 'var(--terre)');
        var clock = '<span id="pt-timer-' + x.id + '" title="Temps passé sur cette tâche" style="font-family:var(--font-micro);font-variant-numeric:tabular-nums;font-weight:700;font-size:13px;color:' + col + ';min-width:54px;text-align:right">' + mtClock(sec) + '</span>';
        var btn = run
          ? '<button class="pbtn" style="color:var(--orange)" title="Mettre le chrono en pause" onclick="ADM.ptPause(\'' + x.id + '\')">⏸</button>'
          : '<button class="pbtn" title="Démarrer le chrono" onclick="ADM.ptStart(\'' + x.id + '\',\'' + x.key + '\')">▶</button>';
        // Saisie manuelle du temps (désactivée pendant que le chrono tourne).
        var edit = run ? '' : '<button class="pbtn" title="Saisir le temps à la main" onclick="ADM.prioSetTime(\'' + x.key + '\',\'' + x.id + '\',' + (x.timeSpentSeconds || 0) + ')">✎</button>';
        return '<span style="display:inline-flex;align-items:center;gap:5px">' + clock + btn + edit + '</span>';
      }
      function prow(x) {
        var iso = (x.dueDate || '').slice(0, 10);
        var brief = prioBrief(x, false);
        return '<div class="prow"' + (brief ? ' style="flex-wrap:wrap"' : '') + '>' +
          '<div class="prow__date"><strong>' + fmtDate(x.dueDate) + '</strong><span style="color:' + whenCol(x._d) + '">' + whenLabel(x._d) + '</span></div>' +
          '<div class="prow__main"><div class="prow__el">' + esc(x.title) + (x.needsRework ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#3f5a37;background:#e3ecdd;padding:3px 8px;border-radius:999px;vertical-align:middle">↩ Retours reçus · à retravailler</span>' : '') +
            (x.kind === 'ticket' ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#8a4a0e;background:#fdf3e8;padding:3px 8px;border-radius:999px;vertical-align:middle">🎫 Ticket</span>' + (x.priority === 'haute' ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#9b3a2e;background:#fbeae5;padding:3px 8px;border-radius:999px;vertical-align:middle">Urgent</span>' : '') + (x.status === 'in_progress' ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#35608f;background:#e3edfb;padding:3px 8px;border-radius:999px;vertical-align:middle">En cours</span>' : '') : '') + '</div>' +
            '<div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + ' · ' + esc(x.kind) + '</div>' + prioClientLink(x, false) + '</div>' +
          (x.id ? '<div class="prow__act">' + prioTimer(x, false) +
            (x.kind === 'ticket' && x.status === 'open' ? '<button class="pbtn" title="Passer le ticket en cours" onclick="ADM.prioTicketStart(\'' + x.key + '\',\'' + x.id + '\')">En cours</button>' : '') +
            (x.project === 'partner' ? '<button class="pbtn" title="Envoyer un lien de révision au client" onclick="ADM.prioSendReview(\'' + x.key + '\',\'' + x.id + '\')">Révision</button>' : '') +
            (x.project === 'partner' ? '<button class="pbtn" title="Déposer un livrable (fichier)" onclick="ADM.prioAddDlv(\'' + x.key + '\',\'' + x.id + '\')">+ Livrable</button>' : '') +
            (x.project === 'partner' ? '<button class="pbtn" title="Déposer un livrable sous forme de lien" onclick="ADM.prioAddDlvLink(\'' + x.key + '\',\'' + x.id + '\')">🔗 Lien</button>' : '') +
            '<button class="pbtn pbtn--ok" title="Marquer fait" onclick="ADM.prioDone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\')">Fait</button>' +
            (x.kind === 'tâche' || x.kind === 'ticket'
              ? '<button class="pbtn" title="Proposer un report que la cliente devra accepter" onclick="ADM.prioProposeDate(\'' + x.key + '\',\'' + x.id + '\',\'' + iso + '\',\'' + x.kind + '\')">Proposer report</button>'
              : '<button class="pbtn" title="Reporter à une autre date" onclick="ADM.prioPostpone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\',\'' + iso + '\')">Reporter</button>') +
          '</div>' : '<div>' + pill(x.status, SL[x.status] || x.status) + '</div>') +
          // Le brief (souvent un tableau) prend toute la largeur de la ligne :
          // sinon il est écrasé dans la colonne étroite entre le titre et les actions.
          (brief ? '<div style="flex-basis:100%;width:100%;min-width:0;margin-top:8px">' + brief + '</div>' : '') +
        '</div>';
      }
      function group(title, dotCol, items) {
        if (!items.length) return '';
        return '<div class="pgroup"><div class="pgroup__h"><span class="pdot" style="background:' + dotCol + '"></span><span class="pgroup__t">' + title + '</span><span class="pgroup__c">' + items.length + '</span></div>' + items.map(prow).join('') + '</div>';
      }
      // Filtre par type (toutes / tâches / étapes) appliqué à la liste « à faire »
      var mineF = PRIO_FILTER === 'all' ? mine : mine.filter(function (x) { return x.kind === PRIO_FILTER; });
      var mineBody;
      if (PRIO_GROUP === 'client') {
        var byClient = {};
        mineF.forEach(function (x) { (byClient[x.client] = byClient[x.client] || []).push(x); });
        var clientNames = Object.keys(byClient).sort(function (a, b) {
          var am = Math.min.apply(null, byClient[a].map(function (x) { return x._d; })), bm = Math.min.apply(null, byClient[b].map(function (x) { return x._d; }));
          return am - bm;
        });
        mineBody = clientNames.map(function (nm) {
          var items = byClient[nm].slice().sort(function (a, b) { return a._d - b._d; });
          var urgent = items.some(function (x) { return x._d <= 0; });
          return group(nm, urgent ? 'var(--red)' : 'var(--glycine-900)', items);
        }).join('');
      } else {
        var late = mineF.filter(function (x) { return x._d < 0; });
        var tdy = mineF.filter(function (x) { return x._d === 0; });
        var week = mineF.filter(function (x) { return x._d > 0 && x._d <= 7; });
        var later = mineF.filter(function (x) { return x._d > 7; });
        mineBody = group('En retard', 'var(--red)', late) + group("Aujourd'hui", 'var(--orange)', tdy) + group('Cette semaine', 'var(--glycine-900)', week) + group('Plus tard', 'var(--bone-d)', later);
      }
      function prioChip(kind, cur, lbl, onclick) {
        var on = cur === kind;
        return '<button onclick="' + onclick + '" style="padding:5px 12px;border-radius:999px;border:1px solid ' + (on ? 'var(--terre)' : 'var(--bone-d)') + ';cursor:pointer;font-family:var(--font-micro);font-size:10px;letter-spacing:0.05em;text-transform:uppercase;background:' + (on ? 'var(--terre)' : 'transparent') + ';color:' + (on ? 'var(--paille)' : 'var(--muted)') + '">' + lbl + '</button>';
      }
      var prioControls = '<div class="row mb" style="gap:6px;flex-wrap:wrap;align-items:center">' +
        '<span class="micro" style="margin-right:2px">Vue</span>' +
        prioChip('date', PRIO_GROUP, 'Par date', 'ADM.prioSetGroup(\'date\')') +
        prioChip('client', PRIO_GROUP, 'Par client', 'ADM.prioSetGroup(\'client\')') +
        '<span style="width:12px"></span><span class="micro" style="margin-right:2px">Filtre</span>' +
        prioChip('all', PRIO_FILTER, 'Tout', 'ADM.prioSetFilter(\'all\')') +
        prioChip('tâche', PRIO_FILTER, 'Tâches', 'ADM.prioSetFilter(\'tâche\')') +
        prioChip('étape', PRIO_FILTER, 'Étapes', 'ADM.prioSetFilter(\'étape\')') +
        prioChip('ticket', PRIO_FILTER, 'Tickets', 'ADM.prioSetFilter(\'ticket\')') +
        '</div>';
      var mineHtml = prioControls + (mineBody || '<div class="empty">' + (mine.length ? 'Rien ici avec ce filtre.' : 'Rien à traiter, tout est à jour.') + '</div>');

      // Focus du jour : ce qui doit bouger maintenant (retard + aujourd'hui), actions directes
      function focusRow(x) {
        var iso = (x.dueDate || '').slice(0, 10);
        var overdue = x._d < 0;
        var whenLight = overdue ? '#efb2a2' : (x._d === 0 ? '#eccd93' : 'rgba(242,229,194,0.62)');
        var fBrief = prioBrief(x, true);
        return '<div class="focusrow"' + (fBrief ? ' style="flex-wrap:wrap"' : '') + '>' +
          '<div style="flex:1;min-width:0"><div style="font-weight:600;color:var(--paille);font-size:14.5px">' + esc(x.title) + (x.needsRework ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#dff0d5;background:rgba(63,90,55,0.55);padding:3px 8px;border-radius:999px;vertical-align:middle">↩ Retours reçus</span>' : '') + '</div>' +
            '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.03em;text-transform:uppercase;color:rgba(242,229,194,0.6);margin-top:3px"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + ' · <span style="color:' + whenLight + ';font-weight:700">' + whenLabel(x._d) + '</span></div>' + prioClientLink(x, true) + '</div>' +
          (x.id ? '<div class="prow__act" style="flex-shrink:0">' + prioTimer(x, true) +
            (x.project === 'partner' ? '<button class="pbtn" title="Envoyer un lien de révision au client" onclick="ADM.prioSendReview(\'' + x.key + '\',\'' + x.id + '\')">Révision</button>' : '') +
            (x.project === 'partner' ? '<button class="pbtn" title="Déposer un livrable (fichier)" onclick="ADM.prioAddDlv(\'' + x.key + '\',\'' + x.id + '\')">+ Livrable</button>' : '') +
            (x.project === 'partner' ? '<button class="pbtn" title="Déposer un livrable sous forme de lien" onclick="ADM.prioAddDlvLink(\'' + x.key + '\',\'' + x.id + '\')">🔗 Lien</button>' : '') +
            '<button class="pbtn pbtn--ok" onclick="ADM.prioDone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\')">Fait</button>' +
            (x.kind === 'tâche' || x.kind === 'ticket'
              ? '<button class="pbtn" title="Proposer un report que la cliente devra accepter" onclick="ADM.prioProposeDate(\'' + x.key + '\',\'' + x.id + '\',\'' + iso + '\',\'' + x.kind + '\')">Proposer report</button>'
              : '<button class="pbtn" onclick="ADM.prioPostpone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\',\'' + iso + '\')">Reporter</button>') +
          '</div>' : '') +
          (fBrief ? '<div style="flex-basis:100%;width:100%;min-width:0;margin-top:8px">' + fBrief + '</div>' : '') +
        '</div>';
      }
      // Indépendant de la vue (par date / par client) et du filtre : sinon le
      // rendu plantait en vue « Par client » (late/tdy non définies) et les
      // onglets ne répondaient plus.
      var focusItems = mine.filter(function (x) { return x._d <= 0; }).sort(function (a, b) { return a._d - b._d; });
      var focusBand = focusItems.length
        ? '<div class="focusband"><div class="focusband__h">Focus du jour<span class="focusband__c">' + focusItems.length + '</span></div>' + focusItems.map(focusRow).join('') + '</div>'
        : '<div class="focusband focusband--clear"><span style="font-size:18px">✓</span> Rien d\'urgent aujourd\'hui, tu es à jour.</div>';

      // Révisions demandées par le client : la balle est dans votre camp
      var revs = d.revisions || [];
      function revRow(r) {
        var atts = Array.isArray(r.attachments) ? r.attachments : [];
        var filesHtml = (atts.length || r.clientLink)
          ? '<div style="margin-top:8px"><div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-bottom:4px">Fichiers redéposés par la cliente</div><div style="display:flex;flex-wrap:wrap;gap:7px">' +
            (r.clientLink ? '<a class="btn btn--outline btn--sm" href="' + esc(/^https?:\/\//i.test(r.clientLink) ? r.clientLink : 'https://' + r.clientLink) + '" target="_blank" rel="noopener">🔗 ' + esc(r.clientLink.replace(/^https?:\/\//i, '').slice(0, 50)) + '</a>' : '') +
            atts.map(function (a) { return '<a class="btn btn--outline btn--sm" href="/api/clients/' + r.key + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank">📎 ' + esc(a.name || 'fichier') + '</a>'; }).join('') +
          '</div></div>'
          : '';
        return '<div style="display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:13px;margin-bottom:9px;background:rgba(155,58,46,0.06)">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:600;color:var(--terre);font-size:14.5px">' + esc(r.name) + (r.taskTitle ? ' <span style="font-family:var(--font-micro);font-size:10px;text-transform:uppercase;letter-spacing:0.03em;color:var(--muted)">(' + esc(r.taskTitle) + ')</span>' : '') + '</div>' +
            '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.03em;text-transform:uppercase;color:var(--muted);margin-top:3px"><a href="javascript:ADM.openClient(\'' + r.key + '\')">' + esc(r.client) + '</a> · ' + esc(r.projectLabel) + (r.at ? ' · demandé le ' + fmtDate(r.at) : '') + '</div>' +
            (r.comment ? '<div style="font-family:var(--font-body);font-style:italic;font-size:13px;color:var(--terre);margin-top:6px;line-height:1.45">« ' + esc(r.comment) + ' »</div>' : '') +
            filesHtml +
          '</div>' +
          '<div class="prow__act" style="flex-shrink:0">' +
            ((r.project === 'partner' && r.taskId) ? '<button class="pbtn pbtn--ok" title="Déposer la nouvelle version" onclick="ADM.prioAddDlv(\'' + r.key + '\',\'' + r.taskId + '\')">+ Nouvelle version</button>' : '') +
            '<button class="pbtn" onclick="ADM.openClient(\'' + r.key + '\')">Ouvrir</button>' +
          '</div>' +
        '</div>';
      }
      // Relances intelligentes : on trie par ancienneté d'attente et on signale ce qui traîne
      var waitAll = waiting.map(function (x) { return { kind: 'step', x: x, since: -ddiff(x.dueDate) }; })
        .concat(pv.map(function (l) { return { kind: 'dlv', x: l, since: -ddiff(l.createdAt) }; }))
        .concat(reviewWait.map(function (x) { var rd = x.reviewSentAt || x.dueDate || ''; return { kind: 'review', x: x, since: rd ? -ddiff(rd) : 0 }; }));
      waitAll.sort(function (a, b) { return b.since - a.since; });
      function waitRow(w) {
        var x = w.x, s = w.since;
        var flag = s >= 10 ? '#fbeae5' : (s >= 5 ? '#fbf5e6' : '');
        var ageCol = s >= 10 ? '#b5462f' : (s >= 5 ? '#b8871f' : 'var(--muted)');
        var ageLbl = s > 0 ? ('en attente depuis ' + s + ' j' + (s >= 5 ? ' · à relancer' : '')) : 'tout récent';
        var isReview = w.kind === 'review';
        var isStep = w.kind === 'step';
        var refDate = isStep ? x.dueDate : (isReview ? (x.reviewSentAt || x.dueDate) : x.createdAt);
        var title = (isStep || isReview) ? esc(x.title) : (esc(x.name) + (x.taskTitle ? ' <span class="micro">(' + esc(x.taskTitle) + ')</span>' : ''));
        var kindArg = isStep ? 'step' : (isReview ? 'review' : 'deliverable');
        var titleArg = (isStep || isReview) ? jsq(x.title) : jsq(x.name);
        var badgeHtml = isReview
          ? '<span class="pill" style="background:#fbf0d8;color:#8a6f2e">Révision à faire</span>'
          : pill(isStep ? 'waiting_client' : 'a_valider', isStep ? 'Étape' : 'Livrable');
        var reviewUrl = (isReview && x.reviewLink) ? (/^https?:\/\//i.test(x.reviewLink) ? x.reviewLink : 'https://' + x.reviewLink) : '';
        var linkBtn = reviewUrl ? '<a class="pbtn" href="' + esc(reviewUrl) + '" target="_blank" rel="noopener" title="Ouvrir le lien de révision">Ouvrir</a>' : '';
        // Lien affiché en clair (cliquable) pour le retrouver d'un coup d'œil.
        var linkLine = reviewUrl ? '<div style="margin-top:4px;font-size:12.5px;display:flex;align-items:center;gap:6px"><span style="flex-shrink:0;opacity:0.6">🔗</span><a href="' + esc(reviewUrl) + '" target="_blank" rel="noopener" style="color:var(--glycine-900);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(x.reviewLink) + '</a></div>' : '';
        // Temps passé : on affiche le même chrono que sur les révisions
        // (temps + ▶ + ✎) sur les livrables/étapes en attente. Pour un livrable,
        // la cible est la tâche sous-jacente (taskId), pas le livrable lui-même.
        var timeObj = isReview ? x
          : (w.kind === 'dlv'
            ? (x.taskId ? { id: x.taskId, key: x.key, project: 'partner', timeSpentSeconds: x.timeSpentSeconds || 0 } : null)
            : { id: x.id, key: x.key, project: 'partner', timeSpentSeconds: x.timeSpentSeconds || 0 });
        var timerHtml = timeObj ? prioTimer(timeObj, false) : '';
        return '<div class="prow"' + (flag ? ' style="background:' + flag + ';border-radius:9px"' : '') + '>' +
          '<div class="prow__date">' + (refDate ? '<strong>' + fmtDate(refDate) + '</strong>' : '<strong>—</strong>') + '<span style="color:' + ageCol + ';font-weight:600">' + ageLbl + '</span></div>' +
          '<div class="prow__main"><div class="prow__el">' + title + '</div><div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + (isReview ? ' · en attente de sa révision' : '') + '</div>' + linkLine + '</div>' +
          '<div class="prow__act">' + timerHtml + badgeHtml + linkBtn +
            (isReview ? '<button class="pbtn" title="Déposer un livrable (fichier)" onclick="ADM.prioAddDlv(\'' + x.key + '\',\'' + x.id + '\')">+ Livrable</button>' : '') +
            (isReview ? '<button class="pbtn" title="Déposer un livrable sous forme de lien" onclick="ADM.prioAddDlvLink(\'' + x.key + '\',\'' + x.id + '\')">🔗 Lien</button>' : '') +
            (isReview ? '<button class="pbtn pbtn--ok" title="Valider toi-même et marquer terminé" onclick="ADM.prioDone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\')">Valider</button>' : '') +
            '<button class="pbtn" title="Envoyer un rappel par mail" onclick="ADM.remind(\'' + x.key + '\',\'' + kindArg + '\',\'' + titleArg + '\',\'' + jsq(x.projectLabel) + '\')">Relancer</button></div></div>';
      }
      var waitHtml = waitAll.map(waitRow).join('');

      var forf = (d.forfaits || []).map(function (f) {
        var nameLink = '<strong style="font-size:14px"><a href="javascript:ADM.openClient(\'' + f.key + '\')">' + esc(f.client) + '</a></strong>';
        if (!f.configured) {
          return '<div class="prow" style="display:block;padding:11px 4px"><div class="between">' + nameLink + '<span class="micro" style="color:var(--muted)">non défini</span></div></div>';
        }
        var pct = f.base > 0 ? Math.min(100, Math.round(f.used / f.base * 100)) : 0;
        var over = f.remaining < 0;
        var low = !over && f.remaining <= f.base * 0.2;
        var restCol = over ? 'var(--red)' : (low ? 'var(--orange)' : 'var(--green)');
        var restLabel = over ? ('dépassé de ' + Math.abs(f.remaining) + ' h') : ('reste ' + f.remaining + ' h');
        return '<div class="prow" style="display:block;padding:12px 4px">' +
          '<div class="between" style="align-items:baseline">' + nameLink +
            '<span style="font-weight:700;font-size:15px;color:' + restCol + '">' + restLabel + '</span></div>' +
          '<div class="bar' + (over ? ' over' : '') + '" style="margin-top:7px"><span style="width:' + pct + '%"></span></div>' +
          '<div class="micro" style="margin-top:5px;color:var(--muted)">' + f.used + ' h consommées sur ' + f.base + ' h · ' + pct + '%</div>' +
        '</div>';
      }).join('');

      // Charge de la semaine : temps estimé par jour (5 prochains jours ouvrés).
      // Estimation par tâche : son temps estimé s'il existe, sinon 45 min par défaut.
      var EST_DEFAULT = 45;
      var weekLoad = [];
      var cursor = new Date(today);
      while (weekLoad.length < 5) {
        var dow = cursor.getDay();
        if (dow !== 0 && dow !== 6) {
          var iso = cursor.getFullYear() + '-' + ('0' + (cursor.getMonth() + 1)).slice(-2) + '-' + ('0' + cursor.getDate()).slice(-2);
          var dayTasks = mine.filter(function (x) { return (x.dueDate || '').slice(0, 10) === iso && x.status !== 'done'; });
          var mins = dayTasks.reduce(function (s, x) { return s + (x.estMinutes > 0 ? x.estMinutes : EST_DEFAULT); }, 0);
          var isToday = weekLoad.length === 0 && cursor.getTime() === today.getTime();
          weekLoad.push({ count: dayTasks.length, mins: mins, label: isToday ? 'Auj.' : cursor.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '') });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      var weekMinTotal = weekLoad.reduce(function (s, w) { return s + w.mins; }, 0);
      var weekCapH = d.weeklyCapacity || 0;
      var dayCapMin = weekCapH ? (weekCapH * 60 / 5) : 0; // seuil « journée pleine »
      var maxLoad = Math.max.apply(null, weekLoad.map(function (w) { return w.mins; }).concat([dayCapMin, 60])) || 60;
      function hLabel(m) { m = Math.round(m); if (!m) return '·'; if (m < 60) return m + ' min'; var h = Math.floor(m / 60), r = m % 60; return h + 'h' + (r ? ('' + (r < 10 ? '0' : '') + r) : ''); }
      var meteo = '<div class="card infocard"><h3><span class="infocard__dot" style="background:#5e3fa0"></span>Charge de la semaine</h3>' +
        '<div class="between" style="align-items:baseline;margin-bottom:10px"><span class="micro" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Temps prévu, estimé par jour</span>' +
          '<span style="font-weight:700;font-size:15px;color:' + (weekCapH && weekMinTotal > weekCapH * 60 ? 'var(--red)' : 'var(--terre)') + '">' + hLabel(weekMinTotal) + (weekCapH ? ' <span style="font-weight:400;font-size:12px;color:var(--muted)">/ ' + weekCapH + 'h</span>' : '') + '</span></div>' +
        '<div style="display:flex;align-items:flex-end;gap:10px;padding-top:6px;min-height:78px">' +
        weekLoad.map(function (w) {
          var barH = w.mins ? Math.max(Math.round(w.mins / maxLoad * 60), 6) : 3;
          var heavy = dayCapMin ? w.mins > dayCapMin : w.mins >= 240;
          var col = heavy ? '#a23c28' : (w.mins ? '#5e3fa0' : 'var(--bone-d)');
          return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px">' +
            '<div style="font-family:var(--font-micro);font-size:11px;font-weight:700;color:' + (heavy ? '#a23c28' : 'var(--terre)') + '">' + hLabel(w.mins) + '</div>' +
            '<div style="width:100%;height:' + barH + 'px;border-radius:5px 5px 0 0;background:' + col + '" title="' + w.count + ' tâche' + (w.count > 1 ? 's' : '') + '"></div>' +
            '<div style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted)">' + esc(w.label) + '</div>' +
          '</div>';
        }).join('') +
        '</div>' +
        (weekCapH ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:8px">Barre rouge = journée au-delà de ta capacité (~' + hLabel(dayCapMin) + '/jour). Estimation basée sur le temps estimé des tâches, ou ' + EST_DEFAULT + ' min par défaut.</div>' : '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:8px">Renseigne ta capacité (dans « Ma capacité » ci-dessus) pour repérer les journées trop chargées.</div>') +
        '</div>';

      // ── Risques (7 j) : ce qui menace de glisser — retards + non démarré à échéance proche
      var riskItems = [];
      mine.forEach(function (x) {
        if (x.status === 'done') return;
        if (x._d < 0) riskItems.push({ x: x, level: 'high', reason: (-x._d) + ' j de retard' });
        else if (x._d <= 2 && x.status === 'todo') riskItems.push({ x: x, level: 'high', reason: 'pas commencé · ' + whenLabel(x._d) });
        else if (x._d <= 6 && x.status === 'todo') riskItems.push({ x: x, level: 'med', reason: 'pas commencé · ' + whenLabel(x._d) });
        else if (x._d <= 2 && x.status === 'in_progress') riskItems.push({ x: x, level: 'med', reason: 'en cours · ' + whenLabel(x._d) });
      });
      riskItems.sort(function (a, b) { return a.x._d - b.x._d; });
      var nRiskHigh = riskItems.filter(function (r) { return r.level === 'high'; }).length;
      function riskRow(r) {
        var x = r.x;
        var col = r.level === 'high' ? '#a23c28' : '#b8871f';
        var bg = r.level === 'high' ? '#fbeae5' : '#fbf5e6';
        return '<div class="prow" style="background:' + bg + ';border-radius:9px">' +
          '<div class="prow__date"><strong>' + (x.dueDate ? fmtDate(x.dueDate) : '—') + '</strong><span style="color:' + col + ';font-weight:600">' + esc(r.reason) + '</span></div>' +
          '<div class="prow__main"><div class="prow__el">' + esc(x.title) + (x.kind === 'ticket' ? ' <span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#8a4a0e;background:#fdf3e8;padding:3px 8px;border-radius:999px;vertical-align:middle">🎫 Ticket</span>' : '') + '</div><div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + '</div></div>' +
          '<div class="prow__act">' + (x.project === 'partner' ? prioTimer(x, false) : '') + '<button class="pbtn" onclick="ADM.openClient(\'' + x.key + '\')">Ouvrir</button></div>' +
        '</div>';
      }

      // ── Engagement clientes : qui a des choses « dans son camp », et depuis quand
      var engMap = {};
      function engBump(key, client, sinceDays) {
        var e = engMap[key] || (engMap[key] = { key: key, client: client, count: 0, oldest: 0 });
        e.count++; if (sinceDays > e.oldest) e.oldest = sinceDays;
      }
      waiting.forEach(function (x) { engBump(x.key, x.client, Math.max(0, -ddiff(x.dueDate))); });
      reviewWait.forEach(function (x) { var rd = x.reviewSentAt || x.dueDate || ''; engBump(x.key, x.client, rd ? Math.max(0, -ddiff(rd)) : 0); });
      pv.forEach(function (l) { engBump(l.key, l.client, l.createdAt ? Math.max(0, -ddiff(l.createdAt)) : 0); });
      var engList = Object.keys(engMap).map(function (k) { return engMap[k]; }).sort(function (a, b) { return b.oldest - a.oldest || b.count - a.count; });
      var engRelance = engList.filter(function (e) { return e.oldest >= 5; }).length;
      function engRow(e) {
        var relance = e.oldest >= 5;
        var col = e.oldest >= 10 ? '#a23c28' : (relance ? '#b8871f' : 'var(--muted)');
        var ageLbl = e.oldest > 0 ? ('depuis ' + e.oldest + ' j') : 'tout récent';
        return '<div class="prow"' + (relance ? ' style="background:' + (e.oldest >= 10 ? '#fbeae5' : '#fbf5e6') + ';border-radius:9px"' : '') + '>' +
          '<div class="prow__main"><div class="prow__el"><a href="javascript:ADM.openClient(\'' + e.key + '\')">' + esc(e.client) + '</a></div>' +
            '<div class="prow__meta">' + e.count + ' élément' + (e.count > 1 ? 's' : '') + ' dans son camp · <span style="color:' + col + ';font-weight:600">' + esc(ageLbl) + '</span>' + (relance ? ' · à relancer' : '') + '</div></div>' +
          '<div class="prow__act"><button class="pbtn" onclick="ADM.openClient(\'' + e.key + '\')">Ouvrir</button></div>' +
        '</div>';
      }

      // ── Onglets : on segmente la page (plus de long scroll) ──
      var tabDefs = [['todo', 'À faire', mine.length, false], ['waiting', 'Attente client', nWait, false]];
      if (riskItems.length) tabDefs.push(['risks', 'Risques', riskItems.length, nRiskHigh > 0]);
      if (engList.length) tabDefs.push(['engagement', 'Engagement', engList.length, engRelance > 0]);
      if (revs.length) tabDefs.push(['revisions', 'Révisions', revs.length, true]);
      tabDefs.push(['load', 'Charge & forfaits', null, false]);
      if (!tabDefs.some(function (t) { return t[0] === PRIO_TAB; })) PRIO_TAB = 'todo';
      var tabBar = '<div class="tabs">' + tabDefs.map(function (t) {
        var b = t[3] ? badgeAlert(t[2]) : (t[2] != null ? badge(t[2]) : '');
        return '<button class="tab' + (PRIO_TAB === t[0] ? ' active' : '') + '" onclick="ADM.prioSetTab(\'' + t[0] + '\')">' + esc(t[1]) + b + '</button>';
      }).join('') + '</div>';

      var tabBody;
      if (PRIO_TAB === 'waiting') {
        tabBody = '<div class="card infocard" style="background:var(--card)"><h3>En attente du client</h3>' +
          '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Trié par ancienneté : ce qui traîne remonte en premier, avec un rappel possible en un clic.</div>' +
          (waitHtml || '<div class="empty">Rien en attente côté client.</div>') + '</div>';
      } else if (PRIO_TAB === 'engagement') {
        tabBody = '<div class="card infocard" style="background:var(--card)"><h3>Engagement des clientes</h3>' +
          '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Qui a des éléments « dans son camp » (à valider, à réviser, à renvoyer) et depuis combien de temps. Celles au-delà de 5 jours méritent une relance plus personnelle.</div>' +
          (engList.map(engRow).join('') || '<div class="empty">Aucune cliente n\'a d\'action en attente — tout est de ton côté.</div>') + '</div>';
      } else if (PRIO_TAB === 'risks') {
        tabBody = '<div class="card"><h3 style="color:#a23c28">Risques · 7 jours</h3>' +
          '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Ce qui menace de glisser : en retard, ou pas encore démarré avec une échéance proche. Anticipe pour éviter le coup de feu.</div>' +
          (riskItems.map(riskRow).join('') || '<div class="empty">Aucun risque — tout est sous contrôle.</div>') + '</div>';
      } else if (PRIO_TAB === 'revisions') {
        tabBody = '<div class="card"><h3 style="color:#a23c28">Révisions demandées</h3>' +
          '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--muted)">Le client a demandé une révision. Déposez la nouvelle version pour repasser le livrable en « à valider ».</div>' +
          (revs.map(revRow).join('') || '<div class="empty">Aucune révision en attente.</div>') + '</div>';
      } else if (PRIO_TAB === 'load') {
        var engagedMonthly = Math.round((d.forfaits || []).reduce(function (s, f) { return s + (f.configured && f.remaining > 0 ? f.remaining : 0); }, 0) * 10) / 10;
        var weeklyCap = d.weeklyCapacity || 0;
        var monthlyCap = Math.round(weeklyCap * 4.33 * 10) / 10;
        var capPct = monthlyCap > 0 ? Math.min(100, Math.round(engagedMonthly / monthlyCap * 100)) : 0;
        var capOver = monthlyCap > 0 && engagedMonthly > monthlyCap;
        var capCard = '<div class="card infocard" style="background:var(--card)"><h3>Ma capacité</h3>' +
          '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Les heures qu\'il te reste à livrer sur les forfaits ce mois, face à ta capacité.</div>' +
          '<div class="row" style="gap:8px;align-items:center;margin-bottom:14px"><span class="micro">Ma capacité</span><input class="inp" type="number" min="0" step="1" value="' + weeklyCap + '" style="width:80px" onchange="ADM.capSave(this.value)"><span class="micro" style="text-transform:none;letter-spacing:0">h/semaine' + (monthlyCap ? ' · ~' + monthlyCap + ' h/mois' : '') + '</span></div>' +
          (monthlyCap > 0
            ? '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:8px"><span style="font-family:var(--font-display);font-style:italic;font-size:32px;color:' + (capOver ? 'var(--red)' : 'var(--terre)') + '">' + engagedMonthly + ' h</span><span class="micro" style="text-transform:none;letter-spacing:0">engagées sur ~' + monthlyCap + ' h · ' + capPct + '%</span></div>' +
              '<div class="bar' + (capOver ? ' over' : '') + '"><span style="width:' + capPct + '%"></span></div>' +
              (capOver ? '<div class="micro" style="color:var(--red);margin-top:7px;text-transform:none;letter-spacing:0">Au-delà de ta capacité — prudence sur les nouveaux engagements.</div>' : '<div class="micro" style="color:var(--muted);margin-top:7px;text-transform:none;letter-spacing:0">Il te reste ~' + (Math.round((monthlyCap - engagedMonthly) * 10) / 10) + ' h de marge ce mois.</div>')
            : '<div style="font-family:var(--font-display);font-style:italic;font-size:28px;color:var(--terre)">' + engagedMonthly + ' h engagées ce mois</div><div class="micro" style="color:var(--muted);margin-top:4px;text-transform:none;letter-spacing:0">Renseigne ta capacité hebdomadaire pour voir ta marge.</div>') +
        '</div>';
        tabBody = '<div class="pcols">' + capCard + meteo +
          '<div class="card infocard" style="background:var(--card)"><h3>Forfaits du mois</h3>' +
            (forf || '<div class="empty">Aucun forfait partenaire.</div>') + '</div></div>';
      } else {
        tabBody = '<div class="card infocard" style="background:var(--card)"><h3>Ce que tu as à faire</h3>' +
          (mineHtml || '<div class="empty">Rien à traiter, tout est à jour.</div>') + '</div>';
      }

      var qd = d.qnrDone || [];
      var qnrDoneCard = qd.length ? '<div class="card infocard" style="background:var(--card)">' +
        '<h3><span class="infocard__dot" style="background:#8267ab"></span>Questionnaires reçus · ' + qd.length + '</h3>' +
        '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Ces clientes ont complété un questionnaire — consulte leurs réponses.</div>' +
        qd.map(function (q) {
          return '<div class="file" style="gap:10px"><span class="nm">' + esc(q.name) + ' <span class="micro" style="color:var(--muted)">· ' + esc(q.client) + (q.completedAt ? ' · ' + fmtDate(q.completedAt) : '') + '</span></span>' +
            '<button class="btn btn--dark btn--sm" onclick="ADM.prioConsultQnr(\'' + q.key + '\',\'' + q.id + '\')">Consulter</button></div>';
        }).join('') + '</div>' : '';
      setMain(topbar('Priorités', right, 'Ce qui compte aujourd\'hui, tous clients confondus') + '<div class="wrap">' +
        focusBand + qnrDoneCard + kpis + tabBar + '<div id="priobody">' + tabBody + '</div></div>');
  }

  /* ── Mes tâches (perso admin) + timer ── */
  var MT_TIMER = null, MT_INT = null, MT_TASKS = [], MT_VIEW = 'focus', MT_ADDOPEN = false, MT_TAG = 'all', MT_CLIENTS = [], MT_DONE_LIMIT = 40, MT_EXP = {};
  function mtMoreDone() { MT_DONE_LIMIT += 40; renderMyTasks(); }
  var MT_TAG_COLORS = [['#f2ebff', '#5e3fa0'], ['#eaf1fb', '#35608f'], ['#f6ecd5', '#9c6f18'], ['#eaf1e6', '#4f6a46'], ['#f7ece7', '#a23c28'], ['#efe7d7', '#6b533b']];
  function mtTagColor(name) { var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return MT_TAG_COLORS[h % MT_TAG_COLORS.length]; }
  function mtTagPill(tg) { var c = mtTagColor(tg); return '<span style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:' + c[0] + ';color:' + c[1] + '">' + esc(tg) + '</span>'; }
  // ── Refonte « Studio OS » : mode de travail (axe d'organisation) + énergie ──
  // [clé, libellé, emoji, couleur texte, couleur fond]
  var MT_MODES = [
    ['client', 'Client', '👤', '#a35a1a', '#fdf3e8'],
    ['studio', 'Studio', '🚀', '#35608f', '#eaf1fb'],
    ['marketing', 'Marketing', '📣', '#6c4ea4', '#f4f1fa'],
    ['organisation', 'Organisation', '⚙️', '#4f6a46', '#eaf1e6'],
    ['admin', 'Admin', '💰', '#9c6f18', '#f6ecd5'],
    ['idee', 'Idée', '💡', '#8a6f2e', '#fbf5e6']
  ];
  function mtMode(m) { for (var i = 0; i < MT_MODES.length; i++) if (MT_MODES[i][0] === m) return MT_MODES[i]; return null; }
  function mtModePill(m) { var x = mtMode(m); if (!x) return ''; return '<span title="' + x[1] + '" style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:' + x[4] + ';color:' + x[3] + '">' + x[2] + ' ' + x[1] + '</span>'; }
  // [clé, emoji, libellé, minutes indicatives]
  var MT_ENERGY = [['quick', '🟢', '10 min', 10], ['short', '🟡', '30 min', 30], ['medium', '🟠', '1 h', 60], ['deep', '🔴', 'Demi-journée', 240]];
  function mtEnergy(e) { for (var i = 0; i < MT_ENERGY.length; i++) if (MT_ENERGY[i][0] === e) return MT_ENERGY[i]; return null; }
  function mtEnergyDot(e) { var x = mtEnergy(e); return x ? '<span title="Énergie : ' + x[2] + '" style="font-size:11px">' + x[1] + '</span>' : ''; }
  function mtImpactLabel(i) { return { faible: 'Impact faible', moyen: 'Impact moyen', fort: 'Impact fort' }[i] || ''; }
  // Durée retenue pour la charge du jour : estimation explicite, sinon l'énergie.
  function mtTaskMinutes(t) { if (t.estMinutes) return t.estMinutes; var x = mtEnergy(t.energy); return x ? x[3] : 0; }
  // Aujourd'hui = tâches que tu as épinglées (doDate == aujourd'hui, en local).
  function mtIsToday(t) { if (!t.doDate) return false; var d = new Date(t.doDate); if (isNaN(d)) return false; var td = new Date(); return d.getFullYear() === td.getFullYear() && d.getMonth() === td.getMonth() && d.getDate() === td.getDate(); }
  function mtTodayIso() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var MT_TODAY_CAP = 0; // capacité du jour (minutes), depuis le planning
  function mtCard(t) {
    var est = t.estMinutes ? ('estimé ' + (t.estMinutes / 60).toFixed(1).replace('.0', '') + ' h') : '';
    var dn = t.status === 'done';
    var running = MT_TIMER && MT_TIMER.id === t.id;
    var spent = t.timeSpentSeconds || 0;
    var tcColor = running ? 'var(--green)' : (spent ? 'var(--terre)' : '#c3b9a6');
    var td = new Date(); td.setHours(0, 0, 0, 0);
    var overdue = !dn && t.dueDate && new Date(t.dueDate) < td;
    var dueLbl = t.dueDate ? ((overdue ? 'en retard · ' : 'échéance ') + fmtDate(t.dueDate)) : '';
    var doLbl = t.doDate ? ('à faire le ' + fmtDate(t.doDate)) : '';
    var meta = [est, doLbl, dueLbl].filter(Boolean).join(' · ');
    var subs = Array.isArray(t.subtasks) ? t.subtasks : [];
    var subN = subs.filter(function (s) { return s.done; }).length;
    var subsHtml = subs.length ? '<div style="margin-top:10px">' +
        '<div style="display:flex;justify-content:space-between;font-family:var(--font-micro);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);margin-bottom:5px"><span>Sous-tâches</span><span>' + subN + '/' + subs.length + '</span></div>' +
        '<div style="height:5px;background:var(--surface-2);border-radius:999px;overflow:hidden;margin-bottom:8px"><div style="height:100%;width:' + Math.round(subN / subs.length * 100) + '%;background:var(--green);border-radius:999px"></div></div>' +
        subs.map(function (s) { return '<label style="display:flex;align-items:flex-start;gap:8px;padding:3px 0;cursor:pointer;font-size:13px;color:' + (s.done ? 'var(--muted)' : 'var(--terre)') + '"><input type="checkbox" ' + (s.done ? 'checked' : '') + ' onchange="ADM.mtSubToggle(\'' + t.id + '\',\'' + s.id + '\')" style="margin-top:3px;flex-shrink:0"><span style="flex:1;' + (s.done ? 'text-decoration:line-through' : '') + '">' + esc(s.text) + '</span><button onclick="event.preventDefault();ADM.mtSubDel(\'' + t.id + '\',\'' + s.id + '\')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:12px;flex-shrink:0">✕</button></label>'; }).join('') +
      '</div>' : '';
    var subAdd = (!dn && !t.archived) ? '<input class="inp" id="mtsub-' + t.id + '" placeholder="+ ajouter une sous-tâche" style="margin-top:8px;padding:7px 10px;font-size:12.5px" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.mtSubAdd(\'' + t.id + '\');}">' : '';
    var timerBtn = (dn || t.archived) ? '' : (running
      ? '<button class="pbtn" style="background:rgba(201,149,47,0.16);color:var(--orange)" onclick="ADM.mtPause(\'' + t.id + '\')">⏸ Pause</button>'
      : '<button class="pbtn" onclick="ADM.mtStart(\'' + t.id + '\')">▶ Démarrer</button>');
    var canDrag = !dn && !t.archived;
    var recLbl = { daily: 'chaque jour', weekly: 'chaque semaine', monthly: 'chaque mois' }[t.recurrence];
    var chips = '';
    if (t.mode) chips += mtModePill(t.mode);
    if (t.clientName) chips += '<span onclick="ADM.openClient(\'' + esc(t.clientKey) + '\')" title="Ouvrir la fiche client" style="cursor:pointer;font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:var(--terre);color:var(--paille)">' + esc(t.clientName) + '</span>';
    if (recLbl) chips += '<span title="Tâche récurrente" style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:var(--surface-2);color:var(--terre-600)">↻ ' + recLbl + '</span>';
    var chipsHtml = (chips || (Array.isArray(t.tags) && t.tags.length)) ? '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:7px">' + chips + ((Array.isArray(t.tags) && t.tags.length) ? t.tags.map(mtTagPill).join('') : '') + '</div>' : '';
    return '<div' + (canDrag ? ' draggable="true" ondragstart="ADM.mtDragStart(event,\'' + t.id + '\')" ondragend="ADM.mtDragEnd(event)"' : '') + ' style="background:var(--card);border-radius:13px;padding:14px 15px;margin-bottom:10px;box-shadow:0 3px 12px -8px rgba(28,18,5,0.28)' + (canDrag ? ';cursor:grab' : '') + '">' +
      '<div style="font-size:14.5px;font-weight:500;line-height:1.35;color:' + (dn ? 'var(--muted)' : 'var(--terre)') + (dn ? ';text-decoration:line-through' : '') + '">' + esc(t.title) + '</div>' +
      (meta ? '<div class="micro" style="margin-top:4px;color:' + (overdue ? '#a23c28' : 'var(--muted)') + '">' + meta + '</div>' : '') +
      chipsHtml +
      '<div id="mt-note-' + t.id + '" style="margin-top:5px">' + mtNoteInner(t) + '</div>' +
      subsHtml + subAdd + sessionsBlock(t) +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:12px">' +
        '<span id="mt-timer-' + t.id + '" title="Temps passé" style="font-family:var(--font-micro);font-variant-numeric:tabular-nums;font-weight:700;font-size:15px;color:' + tcColor + '">' + mtClock(spent) + '</span>' +
        '<div class="row" style="gap:5px">' +
          ((!dn && !t.archived) ? '<button class="pbtn" onclick="ADM.mtEditOpen(\'' + t.id + '\')" title="Modifier la tâche">Modifier</button>' : '') +
          timerBtn +
          (t.archived
            ? '<button class="pbtn" onclick="ADM.myTaskArchive(\'' + t.id + '\',false)">Restaurer</button>'
            : (dn
                ? '<button class="pbtn" onclick="ADM.myTaskStatus(\'' + t.id + '\',\'todo\')">Rouvrir</button><button class="pbtn" onclick="ADM.myTaskArchive(\'' + t.id + '\',true)" title="Archiver">Archiver</button>'
                : '<button class="pbtn pbtn--ok" onclick="ADM.myTaskStatus(\'' + t.id + '\',\'done\')">Fait</button>')) +
          '<button class="pbtn" onclick="ADM.myTaskDel(\'' + t.id + '\')" style="color:var(--red)" title="Supprimer">✕</button>' +
        '</div></div></div>';
  }
  // Applique la tâche renvoyée par le serveur à l'état local puis re-rend,
  // SANS relire la liste (KV à cohérence différée : la relecture immédiate
  // renvoyait l'ancienne valeur et l'écran semblait ignorer la modification).
  function mtApplyLocal(task) {
    if (task && task.id) {
      var i = MT_TASKS.findIndex(function (x) { return x.id === task.id; });
      if (i >= 0) MT_TASKS[i] = task; else MT_TASKS.push(task);
    }
    if (VIEW === 'mytasks') renderMyTasksBody();
  }
  function mtSetView(v) { MT_VIEW = v; renderMyTasks(); }
  function mtSetTag(v) { MT_TAG = v; renderMyTasks(); }
  function mtQuickAdd() {
    var inp = el('mt-quick'); if (!inp) return;
    var raw = (inp.value || '').trim(); if (!raw) return;
    var tags = [];
    var text = raw.replace(/#([\p{L}0-9_-]+)/gu, function (_m, w) { tags.push(w); return ' '; });
    var prio = 'normale';
    if (/(^|\s)!+(\s|$)/.test(text) || /!+\s*$/.test(text)) { prio = 'haute'; text = text.replace(/!+/g, ' '); }
    text = text.replace(/\s+/g, ' ').trim();
    if (!text) { toast('Titre requis'); return; }
    var doEl = el('mt-quick-do'); var doDate = doEl && doEl.value ? doEl.value : null;
    jpost('/api/admin/tasks', { title: text, priority: prio, tags: tags, doDate: doDate }).then(function (r) { if (!r.ok) { toast('Erreur'); return null; } return r.json(); }).then(function (task) { if (task) { inp.value = ''; if (doEl) doEl.value = ''; toast('Tâche ajoutée'); mtApplyLocal(task); } }).catch(function () { toast('Erreur'); });
  }
  function mtToggleAdd() { MT_ADDOPEN = !MT_ADDOPEN; renderMyTasks(); }
  // Ajout en masse : une tâche par ligne (« vider son cerveau »).
  function mtBulkAddOpen() {
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:540px;text-align:left">' +
      '<div class="admconfirm__title">Vider ton cerveau · ajouter une liste</div>' +
      '<div class="admconfirm__msg">Écris (ou colle) <b>une tâche par ligne</b>. Tu peux ajouter <b>#étiquette</b> et un <b>!</b> pour la priorité haute.</div>' +
      '<textarea class="inp" id="mt-bulk" style="width:100%;box-sizing:border-box;min-height:200px;resize:vertical" placeholder="Terminer mon site internet\nFaire le site de Sienna\nMettre à jour le CRM"></textarea>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Tout ajouter</button></div>' +
    '</div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var ta = el('mt-bulk');
      var lines = ((ta && ta.value) || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      if (!lines.length) { toast('Ajoute au moins une ligne'); return; }
      close();
      toast('Ajout de ' + lines.length + ' tâche' + (lines.length > 1 ? 's' : '') + '…');
      var reqs = lines.map(function (raw) {
        var tags = [];
        var text = raw.replace(/#([\p{L}0-9_-]+)/gu, function (_m, w) { tags.push(w); return ' '; });
        var prio = 'normale';
        if (/!+/.test(text)) { prio = 'haute'; text = text.replace(/!+/g, ' '); }
        text = text.replace(/\s+/g, ' ').trim();
        if (!text) return Promise.resolve(null);
        return jpost('/api/admin/tasks', { title: text, priority: prio, tags: tags }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
      });
      Promise.all(reqs).then(function (tasks) {
        var n = tasks.filter(Boolean).length;
        toast(n + ' tâche' + (n > 1 ? 's' : '') + ' ajoutée' + (n > 1 ? 's' : '') + ' ✓');
        renderMyTasks();
      });
    };
    document.body.appendChild(ov);
    var f = el('mt-bulk'); if (f) f.focus();
  }
  // Ligne de checklist (vue Liste) : coche pour terminer.
  function mtListRow(t) {
    var pc = { haute: '#b83f29', normale: '#6c4ea4', basse: '#8a7355' }[t.priority || 'normale'];
    var hasNote = !!(t.notes && String(t.notes).trim());
    var subs = Array.isArray(t.subtasks) ? t.subtasks : [];
    var noteMark = (hasNote || subs.length)
      ? '<span title="Cette tâche a des détails" style="flex-shrink:0;color:var(--muted);font-size:12px">📝' + (subs.length ? ' <span style="font-size:11px">' + subs.filter(function (s) { return s.done; }).length + '/' + subs.length + '</span>' : '') + '</span>'
      : '';
    // Ligne dépliable : cliquer le titre (ou « Détails ») ouvre les détails
    // (note, lien, sous-tâches) directement sous la tâche, sans quitter la liste.
    return '<div style="border-bottom:1px solid var(--bone-d)">' +
      '<div style="display:flex;align-items:center;gap:12px;padding:11px 16px">' +
        '<input type="checkbox" onchange="ADM.myTaskStatus(\'' + t.id + '\',\'done\')" style="width:18px;height:18px;flex-shrink:0;cursor:pointer" title="Marquer comme fait">' +
        '<span class="pdot" style="background:' + pc + ';flex-shrink:0"></span>' +
        '<span style="flex:1;font-size:14.5px;color:var(--terre);min-width:0;cursor:pointer" onclick="ADM.mtToggleRow(\'' + t.id + '\')">' + esc(t.title) + (t.mode ? ' ' + mtModePill(t.mode) : '') + (Array.isArray(t.tags) && t.tags.length ? ' ' + t.tags.map(function (tg) { return mtTagPill(tg); }).join(' ') : '') + '</span>' +
        noteMark +
        (t.doDate ? '<span class="micro" style="color:var(--muted);text-transform:none;letter-spacing:0;flex-shrink:0">à faire le ' + fmtDate(t.doDate) + '</span>' : '') +
        '<button class="btn btn--outline btn--sm" style="flex-shrink:0" onclick="event.preventDefault();ADM.mtToggleRow(\'' + t.id + '\')">Détails</button>' +
      '</div>' +
      '<div id="mt-exp-' + t.id + '" style="display:' + (MT_EXP[t.id] ? 'block' : 'none') + ';padding:2px 16px 14px 46px">' +
        '<div id="mt-note-' + t.id + '">' + mtNoteInner(t) + '</div>' +
        mtSubList(t) +
        '<button class="pbtn" style="margin-top:8px" onclick="ADM.mtEditOpen(\'' + t.id + '\')">Tout modifier (date, priorité…)</button>' +
      '</div>' +
    '</div>';
  }
  function mtToggleRow(id) { MT_EXP[id] = !MT_EXP[id]; var e = el('mt-exp-' + id); if (e) e.style.display = (MT_EXP[id] ? 'block' : 'none'); }
  // Sous-tâches compactes, éditables inline (consultation + ajout rapides).
  function mtSubList(t) {
    var subs = Array.isArray(t.subtasks) ? t.subtasks : [];
    var rows = subs.map(function (s) {
      return '<div style="display:flex;align-items:center;gap:8px;padding:3px 0">' +
        '<input type="checkbox"' + (s.done ? ' checked' : '') + ' onchange="ADM.mtSubToggle(\'' + t.id + '\',\'' + s.id + '\')" style="width:15px;height:15px;cursor:pointer">' +
        '<span style="flex:1;font-size:13px;color:var(--terre-600)' + (s.done ? ';text-decoration:line-through;opacity:0.6' : '') + '">' + esc(s.text) + '</span>' +
        '<button onclick="ADM.mtSubDel(\'' + t.id + '\',\'' + s.id + '\')" style="background:none;border:none;color:#c44;cursor:pointer;font-size:14px;line-height:1">×</button>' +
      '</div>';
    }).join('');
    return '<div style="margin-top:8px">' + rows +
      '<div class="row" style="gap:6px;margin-top:4px"><input class="inp" id="mtsub-' + t.id + '" placeholder="+ Ajouter une sous-tâche" style="flex:1;min-width:120px" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.mtSubAdd(\'' + t.id + '\');}"><button class="pbtn" onclick="ADM.mtSubAdd(\'' + t.id + '\')">Ajouter</button></div>' +
    '</div>';
  }
  function mtSaveSubs(id, subs) { jpost('/api/admin/tasks/' + id, { subtasks: subs }, 'PATCH').then(function (r) { if (r.ok) renderMyTasks(); else toast('Erreur'); }); }
  function mtSubAdd(id) { var inp = el('mtsub-' + id); var v = inp ? (inp.value || '').trim() : ''; if (!v) return; var t = MT_TASKS.filter(function (x) { return x.id === id; })[0]; if (!t) return; var subs = Array.isArray(t.subtasks) ? t.subtasks.slice() : []; subs.push({ id: 'st' + Date.now(), text: v, done: false }); mtSaveSubs(id, subs); }
  function mtSubToggle(id, subId) { var t = MT_TASKS.filter(function (x) { return x.id === id; })[0]; if (!t || !Array.isArray(t.subtasks)) return; mtSaveSubs(id, t.subtasks.map(function (s) { return s.id === subId ? { id: s.id, text: s.text, done: !s.done } : s; })); }
  function mtSubDel(id, subId) { var t = MT_TASKS.filter(function (x) { return x.id === id; })[0]; if (!t || !Array.isArray(t.subtasks)) return; mtSaveSubs(id, t.subtasks.filter(function (s) { return s.id !== subId; })); }
  var MT_DRAG = null;
  function mtDragStart(e, id) { if (e.target && /^(INPUT|TEXTAREA|BUTTON|LABEL|SELECT|A)$/.test(e.target.tagName)) { e.preventDefault(); return; } MT_DRAG = id; if (e.dataTransfer) { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; } }
  function mtDragEnd() { MT_DRAG = null; }
  function mtDragOver(e) { e.preventDefault(); var c = e.currentTarget; if (c && c.classList.contains('mtcol')) c.style.background = '#ece0c9'; }
  function mtDragLeave(e) { var c = e.currentTarget; if (c && c.classList.contains('mtcol')) c.style.background = '#f6f2ea'; }
  function mtDrop(e, priority) {
    e.preventDefault();
    var c = e.currentTarget; if (c && c.classList.contains('mtcol')) c.style.background = '#f6f2ea';
    var id = (e.dataTransfer && e.dataTransfer.getData('text/plain')) || MT_DRAG; MT_DRAG = null;
    if (!id) return;
    var t = MT_TASKS.filter(function (x) { return x.id === id; })[0];
    if (t && (t.priority || 'normale') === priority) return;
    jpost('/api/admin/tasks/' + id, { priority: priority }, 'PATCH').then(function (r) { if (r.ok) { toast('Priorité mise à jour'); renderMyTasks(); } else toast('Erreur'); });
  }
  var PT_TIMER = null, PT_INT = null;
  var DOC_BASE_TITLE = '';
  function baseTitle() { if (typeof document === 'undefined') return ''; if (!DOC_BASE_TITLE) DOC_BASE_TITLE = document.title.replace(/^\(\d+\)\s*/, ''); return DOC_BASE_TITLE; }
  function applyTabTitle() { if (typeof document === 'undefined') return; if (MT_TIMER || PT_TIMER || TK_TIMER) return; var b = baseTitle(); document.title = NOTIF_N > 0 ? '(' + NOTIF_N + ') ' + b : b; }
  function tabTimerOn(clock, label) { if (typeof document === 'undefined') return; baseTitle(); document.title = '▶ ' + clock + ' · ' + (label || 'tâche en cours'); }
  function tabTimerOff() { applyTabTitle(); }
  function ptBase(t) { return t.timeSpentSeconds || (t.timeSpentMinutes || 0) * 60; }
  function ptStart(id, key) {
    if (PT_TIMER && PT_TIMER.id !== id) ptPause(PT_TIMER.id, true);
    if (MT_TIMER) mtPause(MT_TIMER.id, true);
    var t = ptFind(id); if (!t) return;
    // key : client concerné (depuis Priorités, tous clients confondus) ;
    // sinon le client actuellement ouvert.
    PT_TIMER = { id: id, key: key || CURKEY, startedAt: Date.now(), base: ptBase(t), title: t.title };
    if (PT_INT) clearInterval(PT_INT);
    tabTimerOn(mtClock(PT_TIMER.base), t.title);
    refreshNavTimer();
    PT_INT = setInterval(function () {
      if (!PT_TIMER) { clearInterval(PT_INT); PT_INT = null; return; }
      var sec = PT_TIMER.base + (Date.now() - PT_TIMER.startedAt) / 1000;
      var span = el('pt-timer-' + PT_TIMER.id);
      if (span) span.textContent = mtClock(sec);
      var nc = el('nav-timer-clock'); if (nc) nc.textContent = mtClock(sec);
      tabTimerOn(mtClock(sec), PT_TIMER.title);
    }, 1000);
    if (VIEW === 'client') renderClient();
  }
  function ptPause(id, silent) {
    if (!PT_TIMER || PT_TIMER.id !== id) return;
    var startedAt = PT_TIMER.startedAt;
    var PT_TIMER_KEY = PT_TIMER.key;
    var total = Math.round(PT_TIMER.base + (Date.now() - PT_TIMER.startedAt) / 1000);
    if (PT_INT) { clearInterval(PT_INT); PT_INT = null; }
    PT_TIMER = null;
    tabTimerOff();
    refreshNavTimer();
    // Total mis à jour localement et affiché tout de suite : pas de relecture
    // serveur (KV à cohérence différée => le chrono retombait à zéro).
    var sessStart = new Date(startedAt).toISOString(), sessEnd = new Date().toISOString();
    var tkey = (PT_TIMER_KEY || CURKEY);
    var local = ptFind(id);
    if (local) { local.timeSpentSeconds = total; local.timeSpentMinutes = Math.round(total / 60); if (!Array.isArray(local.sessions)) local.sessions = []; local.sessions.push({ start: sessStart, end: sessEnd }); }
    // Depuis Priorités : reflète le temps sur la ligne + re-render local.
    var pit = (PRIO_D && Array.isArray(PRIO_D.deadlines)) ? PRIO_D.deadlines.filter(function (x) { return x.id === id; })[0] : null;
    if (pit) pit.timeSpentSeconds = total;
    if (!silent && VIEW === 'client') renderClient();
    else if (!silent && VIEW === 'priorities' && PRIO_D) renderPrioBody(PRIO_D);
    jpost('/api/clients/' + tkey + '/tasks/' + id, { projectId: 'partner', timeSpentSeconds: total, timeSpentMinutes: Math.round(total / 60), sessionStart: sessStart, sessionEnd: sessEnd }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement du temps'); });
  }
  function ptFind(id) {
    var d = (CUR && CUR.domains || []).find(function (x) { return x.id === 'partner'; });
    var ts = d && d.content && Array.isArray(d.content.taches) ? d.content.taches : [];
    var found = ts.find(function (x) { return x.id === id; });
    if (found) return found;
    // Depuis Priorités : la tâche vit dans PRIO_D.deadlines (avec timeSpentSeconds).
    return (PRIO_D && Array.isArray(PRIO_D.deadlines)) ? PRIO_D.deadlines.filter(function (x) { return x.id === id; })[0] : null;
  }
  // ── Chrono des tickets (maintenance) : même logique que les tâches partenaire ──
  var TK_TIMER = null, TK_INT = null;
  function tkFind(id) { var d = findDomain('maintenance'); var ts = d && d.content && Array.isArray(d.content.tickets) ? d.content.tickets : []; return ts.filter(function (t) { return t.id === id; })[0] || null; }
  function tkBase(t) { return t.timeSpentSeconds || (t.timeSpentMinutes || 0) * 60; }
  function tkStart(id) {
    if (PT_TIMER) ptPause(PT_TIMER.id, true);
    if (MT_TIMER) mtPause(MT_TIMER.id, true);
    if (TK_TIMER && TK_TIMER.id !== id) tkPause(TK_TIMER.id, true);
    var t = tkFind(id); if (!t) return;
    TK_TIMER = { id: id, key: CURKEY, startedAt: Date.now(), base: tkBase(t), title: t.title || 'ticket' };
    if (TK_INT) clearInterval(TK_INT);
    tabTimerOn(mtClock(TK_TIMER.base), TK_TIMER.title);
    refreshNavTimer();
    TK_INT = setInterval(function () {
      if (!TK_TIMER) { clearInterval(TK_INT); TK_INT = null; return; }
      var sec = TK_TIMER.base + (Date.now() - TK_TIMER.startedAt) / 1000;
      var span = el('tk-timer-' + TK_TIMER.id); if (span) span.textContent = mtClock(sec);
      var nc = el('nav-timer-clock'); if (nc) nc.textContent = mtClock(sec);
      tabTimerOn(mtClock(sec), TK_TIMER.title);
    }, 1000);
    if (VIEW === 'client') renderClient();
  }
  function tkPause(id, silent) {
    if (!TK_TIMER || TK_TIMER.id !== id) return;
    var total = Math.round(TK_TIMER.base + (Date.now() - TK_TIMER.startedAt) / 1000);
    var tkey = TK_TIMER.key || CURKEY;
    if (TK_INT) { clearInterval(TK_INT); TK_INT = null; }
    TK_TIMER = null; tabTimerOff(); refreshNavTimer();
    var d = findDomain('maintenance');
    if (d && Array.isArray(d.content.tickets)) { var i = d.content.tickets.findIndex(function (t) { return t.id === id; }); if (i !== -1) { d.content.tickets[i].timeSpentSeconds = total; d.content.tickets[i].timeSpentMinutes = Math.round(total / 60); } }
    if (!silent && VIEW === 'client') renderClient();
    jpost('/api/clients/' + tkey + '/tickets/' + id, { projectId: 'maintenance', timeSpentSeconds: total, timeSpentMinutes: Math.round(total / 60) }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement du temps'); });
  }
  function mtFmtSession(x) {
    var a = new Date(x.start), b = new Date(x.end);
    if (isNaN(a) || isNaN(b)) return '';
    var sameDay = a.toDateString() === b.toDateString();
    function hm(d) { return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
    var day = a.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return day + ' · ' + hm(a) + ' → ' + hm(b) + (sameDay ? '' : ' (+1 j)') + ' · ' + mtDur((b - a) / 1000);
  }
  function sessionsBlock(t) {
    var ss = Array.isArray(t.sessions) ? t.sessions : [];
    if (!ss.length) return '';
    var rows = ss.slice(-8).reverse().map(function (x) { var l = mtFmtSession(x); return l ? '<div style="font-family:var(--font-micro);font-size:11.5px;color:var(--terre-600);padding:3px 0;font-variant-numeric:tabular-nums">' + l + '</div>' : ''; }).join('');
    return '<details class="mt" style="margin-top:8px"><summary style="cursor:pointer;font-family:var(--font-micro);font-size:10px;letter-spacing:0.07em;text-transform:uppercase;color:var(--muted);padding:3px 0">Historique du chrono · ' + ss.length + '</summary><div style="padding:4px 0 2px">' + rows + (ss.length > 8 ? '<div class="micro" style="text-transform:none;letter-spacing:0">… et ' + (ss.length - 8) + ' session' + (ss.length - 8 > 1 ? 's' : '') + ' plus ancienne' + (ss.length - 8 > 1 ? 's' : '') + '</div>' : '') + '</div></details>';
  }
  function mtClock(sec) { sec = Math.round(sec); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; function p(n) { return n < 10 ? '0' + n : n; } return (h > 0 ? h + ':' : '') + p(m) + ':' + p(s); }
  function mtDur(sec) { sec = Math.round(sec); if (sec < 60) return sec + ' s'; var h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60); return (h > 0 ? h + ' h ' : '') + (m > 0 ? m + ' min' : (h > 0 ? '' : '0 min')); }
  function mtLinkify(s) {
    s = String(s == null ? '' : s);
    var st = 'color:var(--glycine-900);text-decoration:underline;word-break:break-all';
    return s.split(/(\s+)/).map(function (tok) {
      if (/^https?:\/\//i.test(tok)) return '<a href="' + esc(tok) + '" target="_blank" rel="noopener" style="' + st + '">' + esc(tok) + '</a>';
      // Lien sans protocole (www.… ou domaine.fr/…) : on préfixe https:// pour le rendre cliquable.
      if (/^www\.[^\s]+\.[^\s]+$/i.test(tok) || /^[a-z0-9-]+\.(fr|com|net|org|io|co|be|ch|eu|design|studio)(\/[^\s]*)?$/i.test(tok)) return '<a href="https://' + esc(tok) + '" target="_blank" rel="noopener" style="' + st + '">' + esc(tok) + '</a>';
      return esc(tok);
    }).join('');
  }
  // Rend une valeur de cellule (texte simple OU HTML enrichi rédigé par la
  // cliente) de façon SÛRE : texte échappé + liens cliquables, et seules les
  // balises de mise en forme autorisées (gras/italique/souligné/span de style)
  // sont conservées. Bloque tout HTML dangereux (script, on*, styles à risque).
  var ADM_RICH_TAGS = { B: 'b', STRONG: 'b', I: 'i', EM: 'i', U: 'u', SPAN: 'span', BR: 'br', FONT: 'span', DIV: 'div', P: 'div' };
  var ADM_STYLE_OK = ['color', 'background-color', 'font-size', 'font-weight', 'font-style', 'text-decoration', 'text-decoration-line', 'padding', 'border-radius', 'box-decoration-break', '-webkit-box-decoration-break'];
  function admStyleSafe(style) {
    var out = [];
    String(style || '').split(';').forEach(function (decl) {
      var i = decl.indexOf(':'); if (i < 0) return;
      var prop = decl.slice(0, i).trim().toLowerCase();
      var val = decl.slice(i + 1).trim();
      if (ADM_STYLE_OK.indexOf(prop) === -1) return;
      if (/url\(|expression|javascript:|[<>"@]/i.test(val) || val.length > 40) return;
      out.push(prop + ':' + val);
    });
    return out.join(';');
  }
  function admSerializeRich(node) {
    var out = '';
    for (var i = 0; i < node.childNodes.length; i++) {
      var ch = node.childNodes[i];
      if (ch.nodeType === 3) { out += mtLinkify(ch.nodeValue); continue; }
      if (ch.nodeType !== 1) continue;
      var tag = ADM_RICH_TAGS[ch.tagName];
      if (!tag) { out += admSerializeRich(ch); continue; }
      if (tag === 'br') { out += '<br>'; continue; }
      var stl = (tag === 'span' || tag === 'div') ? admStyleSafe(ch.getAttribute('style') || '') : '';
      out += '<' + tag + (stl ? ' style="' + stl + '"' : '') + '>' + admSerializeRich(ch) + '</' + tag + '>';
    }
    return out;
  }
  function admRichSafe(v) {
    v = String(v == null ? '' : v);
    if (!/<[a-z!/][\s\S]*>/i.test(v)) return mtLinkify(v); // texte simple
    var d = document.createElement('div'); d.innerHTML = v;
    return admSerializeRich(d);
  }
  function mtNoteInner(t) {
    var editLink = '<button onclick="ADM.mtEditNote(\'' + t.id + '\')" style="background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;padding:2px 0;text-decoration:underline">' + (t.notes ? 'Modifier la note' : '+ Ajouter une note ou un lien') + '</button>';
    return (t.notes ? '<div style="font-size:12.5px;color:#6b5b4a;white-space:pre-wrap;line-height:1.5;margin-bottom:2px">' + mtLinkify(t.notes) + '</div>' : '') + editLink;
  }
  function mtEditNote(id) {
    var c = el('mt-note-' + id); if (!c) return;
    var t = MT_TASKS.find(function (x) { return x.id === id; }); var val = (t && t.notes) || '';
    c.innerHTML = '<textarea id="mt-note-ta-' + id + '" class="inp" style="width:100%;box-sizing:border-box;min-height:68px;resize:vertical" placeholder="Note, lien (https://…), détails…">' + esc(val) + '</textarea><div class="row mt" style="gap:6px"><button class="pbtn pbtn--ok" onclick="ADM.mtSaveNote(\'' + id + '\')">Enregistrer</button><button class="pbtn" onclick="ADM.mtNoteRestore(\'' + id + '\')">Annuler</button></div>';
    var ta = el('mt-note-ta-' + id); if (ta) ta.focus();
  }
  function mtNoteRestore(id) { var c = el('mt-note-' + id), t = MT_TASKS.find(function (x) { return x.id === id; }); if (c && t) c.innerHTML = mtNoteInner(t); }
  function mtSaveNote(id) {
    var ta = el('mt-note-ta-' + id); var val = ta ? ta.value : '';
    jpost('/api/admin/tasks/' + id, { notes: val }, 'PATCH').then(function (r) { if (r.ok) { var t = MT_TASKS.find(function (x) { return x.id === id; }); if (t) t.notes = val; mtNoteRestore(id); toast('Note enregistrée'); } else toast('Erreur'); });
  }
  function mtEditOpen(id) {
    var t = MT_TASKS.find(function (x) { return x.id === id; }); if (!t) return;
    var prioOpts = [['haute', 'Haute'], ['normale', 'Normale'], ['basse', 'Basse']].map(function (o) { return '<option value="' + o[0] + '"' + ((t.priority || 'normale') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
    var recOpts = [['', 'Ne pas répéter'], ['daily', 'Chaque jour'], ['weekly', 'Chaque semaine'], ['monthly', 'Chaque mois']].map(function (o) { return '<option value="' + o[0] + '"' + ((t.recurrence || '') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
    var cliOpts = '<option value="">Sans client</option>' + MT_CLIENTS.map(function (c) { return '<option value="' + esc(c.key) + '"' + ((t.clientKey || '') === c.key ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('');
    var modeOpts = '<option value="">Mode… (à classer)</option>' + MT_MODES.map(function (m) { return '<option value="' + m[0] + '"' + ((t.mode || '') === m[0] ? ' selected' : '') + '>' + m[2] + ' ' + m[1] + '</option>'; }).join('');
    var enOpts = '<option value="">Énergie…</option>' + MT_ENERGY.map(function (e) { return '<option value="' + e[0] + '"' + ((t.energy || '') === e[0] ? ' selected' : '') + '>' + e[1] + ' ' + e[2] + '</option>'; }).join('');
    var impOpts = [['', 'Impact…'], ['faible', 'Faible'], ['moyen', 'Moyen'], ['fort', 'Fort']].map(function (o) { return '<option value="' + o[0] + '"' + ((t.impact || '') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
    var tagsVal = Array.isArray(t.tags) ? t.tags.join(', ') : '';
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:520px;text-align:left">' +
      '<div class="admconfirm__title">Modifier la tâche</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">' +
        '<input class="inp" id="mte-title" value="' + esc(t.title || '') + '" placeholder="Titre">' +
        '<div class="row" style="gap:8px"><select class="inp" id="mte-prio" style="flex:1">' + prioOpts + '</select>' +
          '<input class="inp" id="mte-est" type="number" min="0" step="15" value="' + (t.estMinutes || '') + '" placeholder="min" style="width:90px" title="Durée estimée en minutes"></div>' +
        '<div class="row" style="gap:8px">' +
          '<label class="micro" style="flex:1;display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0" title="Le jour où tu comptes t\'en occuper">À faire le <input class="inp" id="mte-do" type="date" value="' + esc(t.doDate || '') + '" style="flex:1"></label>' +
          '<label class="micro" style="flex:1;display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0" title="Date limite">Échéance <input class="inp" id="mte-due" type="date" value="' + esc(t.dueDate || '') + '" style="flex:1"></label></div>' +
        '<div class="row" style="gap:8px"><select class="inp" id="mte-client" style="flex:1">' + cliOpts + '</select>' +
          '<select class="inp" id="mte-recur" style="flex:1">' + recOpts + '</select></div>' +
        '<div class="row" style="gap:8px"><select class="inp" id="mte-mode" style="flex:1" title="Mode de travail">' + modeOpts + '</select>' +
          '<select class="inp" id="mte-energy" style="flex:1" title="Énergie">' + enOpts + '</select>' +
          '<select class="inp" id="mte-impact" style="flex:1" title="Impact">' + impOpts + '</select></div>' +
        '<input class="inp" id="mte-tags" value="' + esc(tagsVal) + '" placeholder="Étiquettes séparées par des virgules">' +
        '<div class="field"><label>Temps passé (minutes) — corrige le chrono si besoin</label><input class="inp" id="mte-time" type="number" min="0" step="5" value="' + Math.round((t.timeSpentSeconds || 0) / 60) + '" style="width:140px"></div>' +
        '<textarea class="inp" id="mte-notes" style="min-height:64px;resize:vertical" placeholder="Note, lien (https://…), détails…">' + esc(t.notes || '') + '</textarea>' +
      '</div>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Enregistrer</button></div>' +
    '</div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var title = (el('mte-title').value || '').trim(); if (!title) { toast('Titre requis'); return; }
      var tags = (el('mte-tags').value || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      var ck = el('mte-client').value, cn = ''; for (var i = 0; i < MT_CLIENTS.length; i++) { if (MT_CLIENTS[i].key === ck) { cn = MT_CLIENTS[i].name; break; } }
      var body = { title: title, priority: el('mte-prio').value, estMinutes: parseInt(el('mte-est').value, 10) || 0, doDate: el('mte-do').value || null, dueDate: el('mte-due').value || null, clientKey: ck, clientName: cn, recurrence: el('mte-recur').value, tags: tags, notes: (el('mte-notes').value || ''), mode: el('mte-mode') ? el('mte-mode').value : '', energy: el('mte-energy') ? el('mte-energy').value : '', impact: el('mte-impact') ? el('mte-impact').value : '' };
      var tm = parseInt(el('mte-time').value, 10);
      if (!isNaN(tm) && tm >= 0 && tm * 60 !== (t.timeSpentSeconds || 0)) { body.timeSpentSeconds = tm * 60; body.forceTime = true; }
      jpost('/api/admin/tasks/' + id, body, 'PATCH').then(function (r) { if (!r.ok) { toast('Erreur'); return null; } return r.json(); }).then(function (task) { if (task) { close(); toast('Tâche modifiée'); mtApplyLocal(task); } }).catch(function () { toast('Erreur'); });
    };
    document.body.appendChild(ov);
    var f = el('mte-title'); if (f) f.focus();
  }
  function mtRow(t) {
    var pcol = { haute: 'var(--red)', normale: 'var(--glycine-900)', basse: '#c3b9a6' }[t.priority] || 'var(--glycine-900)';
    var plabel = { haute: 'Priorité haute', normale: 'Priorité normale', basse: 'Priorité basse' }[t.priority] || t.priority;
    var est = t.estMinutes ? ('estimé ' + (t.estMinutes / 60).toFixed(1).replace('.0', '') + ' h') : '';
    var dn = t.status === 'done';
    var running = MT_TIMER && MT_TIMER.id === t.id;
    var spent = t.timeSpentSeconds || 0;
    var tcColor = running ? 'var(--green)' : (spent ? 'var(--terre)' : '#c3b9a6');
    var timecode = '<span id="mt-timer-' + t.id + '" title="Temps passé" style="font-family:var(--font-micro);font-variant-numeric:tabular-nums;font-weight:700;font-size:16px;letter-spacing:0.02em;color:' + tcColor + ';min-width:74px;text-align:right">' + mtClock(spent) + '</span>';
    var timerBtn = dn ? '' : (running
      ? '<button class="pbtn" style="color:var(--orange);border-color:#f0d8b0" onclick="ADM.mtPause(\'' + t.id + '\')">⏸ Pause</button>'
      : '<button class="pbtn" onclick="ADM.mtStart(\'' + t.id + '\')">▶ Démarrer</button>');
    return '<div class="prow">' +
      '<span class="pdot" style="background:' + pcol + ';align-self:center"></span>' +
      '<div class="prow__main"><div class="prow__el" style="' + (dn ? 'text-decoration:line-through;color:var(--muted)' : '') + '">' + esc(t.title) + '</div>' +
        '<div class="prow__meta">' + plabel + (est ? ' · ' + est : '') + (t.doDate ? ' · à faire le ' + fmtDate(t.doDate) : '') + (t.dueDate ? ' · échéance ' + fmtDate(t.dueDate) : '') + '</div>' +
        '<div id="mt-note-' + t.id + '" style="margin-top:4px">' + mtNoteInner(t) + '</div></div>' +
      '<div class="prow__act">' + timecode + timerBtn +
        (dn ? '<button class="pbtn" onclick="ADM.myTaskStatus(\'' + t.id + '\',\'todo\')">Rouvrir</button>'
            : '<button class="pbtn pbtn--ok" onclick="ADM.myTaskStatus(\'' + t.id + '\',\'done\')">Fait</button>') +
        '<button class="pbtn" onclick="ADM.myTaskDel(\'' + t.id + '\')" style="color:var(--red);border-color:#f0c9c4">Suppr.</button>' +
      '</div></div>';
  }
  function mtStart(id) {
    if (MT_TIMER && MT_TIMER.id !== id) mtPause(MT_TIMER.id, true);
    if (PT_TIMER) ptPause(PT_TIMER.id, true);
    var t = MT_TASKS.find(function (x) { return x.id === id; }); if (!t) return;
    MT_TIMER = { id: id, startedAt: Date.now(), base: t.timeSpentSeconds || 0, title: t.title };
    if (MT_INT) clearInterval(MT_INT);
    tabTimerOn(mtClock(MT_TIMER.base), t.title);
    refreshNavTimer();
    MT_INT = setInterval(function () {
      if (!MT_TIMER) { clearInterval(MT_INT); MT_INT = null; return; }
      var sec = MT_TIMER.base + (Date.now() - MT_TIMER.startedAt) / 1000;
      var span = el('mt-timer-' + MT_TIMER.id);
      if (span) span.textContent = mtClock(sec);
      var nc = el('nav-timer-clock'); if (nc) nc.textContent = mtClock(sec);
      tabTimerOn(mtClock(sec), MT_TIMER.title);
    }, 1000);
    if (VIEW === 'mytasks') renderMyTasksBody();
  }
  function mtPause(id, silent) {
    if (!MT_TIMER || MT_TIMER.id !== id) return;
    var startedAt = MT_TIMER.startedAt;
    var total = Math.round(MT_TIMER.base + (Date.now() - MT_TIMER.startedAt) / 1000);
    if (MT_INT) { clearInterval(MT_INT); MT_INT = null; }
    MT_TIMER = null;
    tabTimerOff();
    refreshNavTimer();
    // Le total est mis à jour localement et affiché tout de suite : on ne
    // relit pas le serveur (KV à cohérence différée => on revoyait zéro).
    var sessStart = new Date(startedAt).toISOString(), sessEnd = new Date().toISOString();
    var local = MT_TASKS.find(function (x) { return x.id === id; });
    if (local) { local.timeSpentSeconds = total; if (!Array.isArray(local.sessions)) local.sessions = []; local.sessions.push({ start: sessStart, end: sessEnd }); }
    if (!silent && VIEW === 'mytasks') renderMyTasksBody();
    jpost('/api/admin/tasks/' + id, { timeSpentSeconds: total, sessionStart: sessStart, sessionEnd: sessEnd }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement du temps'); });
  }
  // ── Visios : préparation des rendez-vous — cards + panneau + déroulé ──
  var VISIOS = { cards: [], templates: [] }, VISIOS_LOADED = false, VIS_TAB = 'cards', VIS_SEL = null;
  function renderVisios() {
    var right = '<button class="btn btn--outline btn--sm" onclick="ADM.visAdd(\'suivi\')">+ Client suivi</button><button class="btn" onclick="ADM.visAdd(\'nouveau\')">+ Nouveau client</button>';
    setMain(topbar('Visios', right, 'Prépare tes rendez-vous : un déroulé étape par étape et tes questions') + '<div class="wrap" id="vis-body"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    if (!NAV_CLIENTS.length) { api('/api/clients').then(function (r) { return r.json(); }).then(function (d) { NAV_CLIENTS = d.clients || []; if (VIEW === 'visios') renderVisiosBody(); }).catch(function () {}); }
    if (VISIOS_LOADED) { renderVisiosBody(); return; }
    api('/api/visios').then(function (r) { return r.json(); }).then(function (d) { VISIOS = { cards: (d && d.cards) || [], templates: (d && d.templates) || [] }; visMigrate(); VISIOS_LOADED = true; renderVisiosBody(); }).catch(showError);
  }
  // Migration douce : les anciennes visios (trame unique) deviennent un déroulé
  // d'étapes (découpé sur les séparateurs). Sauvegardé à la première modif.
  function trameToSteps(trame) {
    var parts = String(trame || '').split(/<hr\s*\/?>/i).map(function (s) { return s.trim(); })
      .filter(function (s) { return s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || /<img/i.test(s); });
    return parts.map(function (h, i) { return { id: 's' + Date.now().toString(36) + i, title: '', html: h }; });
  }
  function visMigrate() { VISIOS.cards.forEach(function (c) { if (!Array.isArray(c.steps)) c.steps = trameToSteps(c.trame); }); }
  function visSave() { jpost('/api/visios', { cards: VISIOS.cards, templates: VISIOS.templates }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement'); }).catch(function () { toast('Erreur'); }); }
  function visCard(id) { return VISIOS.cards.filter(function (c) { return c.id === id; })[0]; }
  function visTpl(id) { return VISIOS.templates.filter(function (t) { return t.id === id; })[0]; }
  function renderVisiosBody() {
    var body = el('vis-body'); if (!body) return;
    var tabs = '<div class="subtabs" style="margin-bottom:18px">' +
      '<button class="subtab' + (VIS_TAB === 'cards' ? ' active' : '') + '" onclick="ADM.visTab(\'cards\')">Rendez-vous · ' + VISIOS.cards.length + '</button>' +
      '<button class="subtab' + (VIS_TAB === 'templates' ? ' active' : '') + '" onclick="ADM.visTab(\'templates\')">Modèles · ' + VISIOS.templates.length + '</button>' +
    '</div>';
    body.innerHTML = tabs + (VIS_TAB === 'cards' ? visCardsHtml() : visTemplatesHtml());
  }
  function visTab(t) { VIS_TAB = t; renderVisiosBody(); }
  function visCardsHtml() {
    function section(cat, label, col) {
      var cards = VISIOS.cards.filter(function (c) { return (c.category || 'nouveau') === cat; })
        .sort(function (a, b) { var ad = a.done ? 1 : 0, bd = b.done ? 1 : 0; if (ad !== bd) return ad - bd; return String(a.date || '9999').localeCompare(String(b.date || '9999')); });
      var grid = cards.length ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:14px">' + cards.map(visCardTile).join('') + '</div>' : '<div class="empty">Aucune visio ici pour le moment.</div>';
      return '<div style="margin-bottom:28px"><div class="between mb"><h3 style="margin:0"><span class="infocard__dot" style="background:' + col + '"></span>' + label + ' · ' + cards.length + '</h3><button class="btn btn--outline btn--sm" onclick="ADM.visAdd(\'' + cat + '\')">+ Ajouter</button></div>' + grid + '</div>';
    }
    return section('nouveau', 'Nouveaux clients', '#9c6f18') + section('suivi', 'Clients suivis', '#4f6a46');
  }
  function visCardTile(c) {
    var name = c.client || (c.category === 'suivi' ? 'Cliente à choisir' : 'Nouveau prospect');
    var nSteps = (c.steps || []).length, nQ = (c.questions || []).length;
    var pill = function (txt) { return '<span style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.03em;color:var(--terre-600);background:var(--surface-2,#f3ede1);padding:3px 9px;border-radius:999px">' + txt + '</span>'; };
    return '<div onclick="ADM.visOpen(\'' + c.id + '\')" style="cursor:pointer;background:var(--card);border:1px solid var(--bone-d);border-radius:14px;padding:15px 16px;display:flex;flex-direction:column;gap:9px' + (c.done ? ';opacity:0.66' : '') + '" onmouseover="this.style.boxShadow=\'var(--shadow-2)\'" onmouseout="this.style.boxShadow=\'none\'">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">' +
        '<div style="font-family:var(--font-display);font-size:19px;color:var(--terre);line-height:1.2">' + esc(name) + '</div>' +
        (c.done ? '<span title="Fait" style="color:#4f6a46;flex-shrink:0">✓</span>' : '') +
      '</div>' +
      '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">' + (c.date ? '🗓️ ' + fmtDT(c.date) : 'Sans date') + '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' + pill(nSteps + ' étape' + (nSteps > 1 ? 's' : '')) + (nQ ? pill(nQ + ' question' + (nQ > 1 ? 's' : '')) : '') + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:4px">' +
        ((nSteps || nQ) ? '<button onclick="event.stopPropagation();ADM.visPresent(\'' + c.id + '\')" class="btn btn--dark btn--sm" style="flex:1">▶ Lancer</button>' : '') +
        '<button onclick="event.stopPropagation();ADM.visOpen(\'' + c.id + '\')" class="btn btn--outline btn--sm" style="flex:1">Ouvrir</button>' +
      '</div>' +
    '</div>';
  }
  // Champ « nom » : sélecteur de cliente (suivi) ou texte libre (prospect).
  function visNameField(c) {
    if (c.category === 'suivi') {
      var picked = c.clientKey && NAV_CLIENTS.filter(function (k) { return k.key === c.clientKey; })[0];
      var opts = '<option value="">— Choisir une cliente —</option>' +
        NAV_CLIENTS.map(function (k) { return '<option value="' + esc(k.key) + '"' + (c.clientKey === k.key ? ' selected' : '') + '>' + esc(clientName(k)) + '</option>'; }).join('') +
        (c.clientKey && !picked ? '<option value="' + esc(c.clientKey) + '" selected>' + esc(c.client || 'Cliente') + '</option>' : '');
      return '<select class="inp" style="flex:1;min-width:160px;font-weight:600" onchange="ADM.visSetClient(\'' + c.id + '\',this.value)">' + opts + '</select>' +
        (c.clientKey ? '<button class="btn btn--outline btn--sm" onclick="ADM.openClient(\'' + c.clientKey + '\')" title="Ouvrir la fiche">Fiche</button>' : '');
    }
    return '<input class="inp" value="' + esc(c.client || '') + '" placeholder="Nom du prospect" style="flex:1;min-width:160px;font-weight:600" onchange="ADM.visSet(\'' + c.id + '\',\'client\',this.value)">';
  }
  // ── Panneau de droite (drawer) : édition complète d'une visio ──
  function visOpen(id) { VIS_SEL = id; renderVisDrawer(); }
  function visCloseDrawer() { VIS_SEL = null; var d = el('vis-drawer'); if (d) d.remove(); var b = el('vis-drawer-bk'); if (b) b.remove(); }
  function renderVisDrawer() {
    var ex = el('vis-drawer'); if (ex) ex.remove(); var exb = el('vis-drawer-bk'); if (exb) exb.remove();
    var c = visCard(VIS_SEL); if (!c) return;
    var bk = document.createElement('div'); bk.id = 'vis-drawer-bk'; bk.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.32);z-index:90'; bk.onclick = visCloseDrawer; document.body.appendChild(bk);
    var d = document.createElement('div'); d.id = 'vis-drawer'; d.style.cssText = 'position:fixed;top:0;right:0;height:100vh;width:min(720px,97vw);background:var(--bg,#faf7f1);z-index:95;box-shadow:-20px 0 54px -18px rgba(28,18,5,0.45);overflow-y:auto';
    d.innerHTML = visDrawerHtml(c); document.body.appendChild(d);
  }
  function visDrawerHtml(c) {
    var steps = Array.isArray(c.steps) ? c.steps : [];
    var hasContent = steps.length || (c.questions || []).length;
    var catSel = '<select class="inp" style="width:auto" onchange="ADM.visSet(\'' + c.id + '\',\'category\',this.value)"><option value="nouveau"' + (c.category !== 'suivi' ? ' selected' : '') + '>Nouveau client</option><option value="suivi"' + (c.category === 'suivi' ? ' selected' : '') + '>Client suivi</option></select>';
    var tplOpts = VISIOS.templates.length ? '<div class="row" style="gap:8px;align-items:center;margin-bottom:16px"><span class="micro" style="text-transform:none;letter-spacing:0">Partir d\'un modèle</span><select class="inp" style="width:auto" onchange="if(this.value){ADM.visApplyTpl(\'' + c.id + '\',this.value);this.value=\'\';}"><option value="">— choisir —</option>' + VISIOS.templates.map(function (t) { return '<option value="' + t.id + '">' + esc(t.name || 'Modèle') + '</option>'; }).join('') + '</select></div>' : '';
    var stepsHtml = steps.map(function (s, idx) { return visStepHtml(c, s, idx, steps.length); }).join('');
    var qsHtml = (c.questions || []).map(function (q) {
      return '<div style="display:flex;align-items:center;gap:8px;padding:3px 0">' +
        '<input type="checkbox"' + (q.done ? ' checked' : '') + ' onchange="ADM.visQToggle(\'' + c.id + '\',\'' + q.id + '\')" style="width:15px;height:15px;cursor:pointer;flex-shrink:0">' +
        '<input class="inp" value="' + esc(q.text) + '" onchange="ADM.visQSet(\'' + c.id + '\',\'' + q.id + '\',this.value)" style="flex:1' + (q.done ? ';text-decoration:line-through;opacity:0.6' : '') + '">' +
        '<button onclick="ADM.visQDel(\'' + c.id + '\',\'' + q.id + '\')" style="background:none;border:none;color:#c44;cursor:pointer;font-size:15px;line-height:1;flex-shrink:0">×</button>' +
      '</div>';
    }).join('');
    return '<div style="position:sticky;top:0;background:var(--bg,#faf7f1);z-index:4;padding:14px 22px;border-bottom:1px solid var(--bone-d);display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<button onclick="ADM.visCloseDrawer()" class="btn btn--outline btn--sm">← Fermer</button>' +
        (hasContent ? '<button onclick="ADM.visPresent(\'' + c.id + '\')" class="btn btn--dark btn--sm">▶ Lancer le déroulé</button>' : '') +
        '<span style="margin-left:auto"></span>' +
        '<label class="checkbox"><input type="checkbox"' + (c.done ? ' checked' : '') + ' onchange="ADM.visSet(\'' + c.id + '\',\'done\',this.checked)"> Fait</label>' +
        '<button onclick="ADM.visDel(\'' + c.id + '\')" class="btn btn--danger btn--sm">Suppr.</button>' +
      '</div>' +
      '<div style="padding:20px 24px 70px;max-width:690px">' +
        '<div class="row" style="gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px">' + catSel + visNameField(c) + '</div>' +
        '<div class="row" style="gap:8px;align-items:center;margin-bottom:20px"><span class="micro">Date & heure</span><input class="inp" type="datetime-local" style="width:auto" value="' + esc(c.date || '') + '" onchange="ADM.visSet(\'' + c.id + '\',\'date\',this.value)"></div>' +
        tplOpts +
        '<div class="between" style="margin-bottom:10px"><h3 style="margin:0">Déroulé</h3><button class="btn btn--outline btn--sm" onclick="ADM.visStepAdd(\'' + c.id + '\')">+ Étape</button></div>' +
        (stepsHtml || '<div class="empty" style="margin-bottom:10px">Ajoute des étapes pour construire ton déroulé (accueil, besoins, présentation…).</div>') +
        '<button class="btn btn--outline btn--sm" style="margin:2px 0 26px" onclick="ADM.visStepAdd(\'' + c.id + '\')">+ Ajouter une étape</button>' +
        '<h3 style="margin:0 0 10px">Questions à poser</h3>' + qsHtml +
        '<div class="row" style="gap:6px;margin:6px 0 26px"><input class="inp" id="vis-q-' + c.id + '" placeholder="+ Ajouter une question" style="flex:1;min-width:140px" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.visQAdd(\'' + c.id + '\');}"><button class="pbtn" onclick="ADM.visQAdd(\'' + c.id + '\')">Ajouter</button></div>' +
        '<h3 style="margin:0 0 8px">Mes retours / notes</h3>' +
        '<textarea class="inp" style="width:100%;box-sizing:border-box;min-height:120px;resize:vertical;font-size:15px;line-height:1.6" placeholder="Annote tes retours : ce qui s\'est dit, les prochaines étapes, ton ressenti…" onchange="ADM.visNoteSave(\'' + c.id + '\',this.value)">' + esc(c.notes || '') + '</textarea>' +
      '</div>';
  }
  function visStepHtml(c, s, idx, total) {
    return '<div class="card" style="background:var(--card);padding:12px 14px;margin-bottom:10px">' +
      '<div class="row" style="gap:8px;align-items:center;margin-bottom:8px">' +
        '<span style="font-family:var(--font-micro);font-size:11px;color:var(--muted);flex-shrink:0">Étape ' + (idx + 1) + '</span>' +
        '<input class="inp" value="' + esc(s.title || '') + '" placeholder="Titre de l\'étape (ex. Accueil, Besoins…)" style="flex:1;font-weight:600" onchange="ADM.visStepSet(\'' + c.id + '\',\'' + s.id + '\',\'title\',this.value)">' +
        '<button class="pbtn" title="Monter"' + (idx === 0 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.visStepMove(\'' + c.id + '\',\'' + s.id + '\',-1)">↑</button>' +
        '<button class="pbtn" title="Descendre"' + (idx === total - 1 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.visStepMove(\'' + c.id + '\',\'' + s.id + '\',1)">↓</button>' +
        '<button class="pbtn" style="color:#c44" title="Supprimer l\'étape" onclick="ADM.visStepDel(\'' + c.id + '\',\'' + s.id + '\')">×</button>' +
      '</div>' +
      visRichEditor('visstep__' + c.id + '__' + s.id, s.html || '', "ADM.visSaveEditor(this)", 120) +
    '</div>';
  }
  function visStepAdd(id) { var c = visCard(id); if (!c) return; if (!Array.isArray(c.steps)) c.steps = []; c.steps.push({ id: 's' + Date.now().toString(36), title: '', html: '' }); visSave(); renderVisDrawer(); renderVisiosBody(); }
  function visStepSet(id, sid, field, val) { var c = visCard(id); if (!c) return; (c.steps || []).forEach(function (s) { if (s.id === sid) s[field] = val; }); visSave(); }
  function visStepDel(id, sid) { var c = visCard(id); if (!c) return; c.steps = (c.steps || []).filter(function (s) { return s.id !== sid; }); visSave(); renderVisDrawer(); renderVisiosBody(); }
  function visStepMove(id, sid, dir) { var c = visCard(id); if (!c) return; var a = c.steps || []; var i = a.findIndex(function (s) { return s.id === sid; }); if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return; var t = a[i]; a[i] = a[j]; a[j] = t; visSave(); renderVisDrawer(); }
  // Sauvegarde unifiée d'un éditeur riche (étape de visio ou de modèle).
  function visSaveEditor(elm) {
    if (!elm) return; var id = elm.id || '', html = elm.innerHTML, p;
    if (id.indexOf('visstep__') === 0) { p = id.split('__'); var c = visCard(p[1]); if (c) { (c.steps || []).forEach(function (s) { if (s.id === p[2]) s.html = html; }); visSave(); } }
    else if (id.indexOf('vistplstep__') === 0) { p = id.split('__'); var t = visTpl(p[1]); if (t) { (t.steps || []).forEach(function (s) { if (s.id === p[2]) s.html = html; }); visSave(); } }
  }
  function visPresent(id) {
    var c = visCard(id); if (!c) return;
    var steps = (Array.isArray(c.steps) ? c.steps : []).filter(function (s) { return (s.title && s.title.trim()) || (s.html && s.html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()) || /<img/i.test(s.html || ''); })
      .map(function (s) { return { title: s.title, html: s.html }; });
    var qs = Array.isArray(c.questions) ? c.questions : [];
    if (qs.length) steps.push({ questions: qs });
    if (!steps.length) { toast('Ajoute d\'abord une étape ou des questions'); return; }
    var i = 0;
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.62);z-index:9600;display:flex;align-items:center;justify-content:center;padding:24px';
    function close() { ov.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); if (i < steps.length - 1) { i++; render(); } } else if (e.key === 'ArrowLeft') { if (i > 0) { i--; render(); } } }
    function render() {
      var st = steps[i];
      var content = st.questions
        ? '<div style="font-family:var(--font-display);font-style:italic;font-size:26px;color:var(--terre);margin-bottom:16px">Questions à poser</div>' + st.questions.map(function (q) { return '<label style="display:flex;align-items:flex-start;gap:11px;padding:9px 0;font-size:19px;line-height:1.5;color:var(--terre);cursor:pointer;border-bottom:1px solid var(--bone-d)"><input type="checkbox"' + (q.done ? ' checked' : '') + ' onchange="ADM.visQToggle(\'' + id + '\',\'' + q.id + '\')" style="width:19px;height:19px;margin-top:3px;flex-shrink:0">' + esc(q.text) + '</label>'; }).join('')
        : ((st.title ? '<div style="font-family:var(--font-display);font-style:italic;font-size:27px;color:var(--terre);margin-bottom:16px">' + esc(st.title) + '</div>' : '') + '<div style="font-size:21px;line-height:1.8;color:var(--terre)">' + (st.html || '') + '</div>');
      ov.innerHTML = '<div style="background:#fff;border-radius:20px;max-width:780px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 22px 66px rgba(28,18,5,0.4)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 24px;border-bottom:1px solid var(--bone-d)">' +
          '<div style="font-family:var(--font-micro);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted)">' + esc(c.client || 'Visio') + ' · Étape ' + (i + 1) + ' / ' + steps.length + '</div>' +
          '<button id="vp-close" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:24px;line-height:1">×</button>' +
        '</div>' +
        '<div style="height:4px;background:var(--bone-d)"><div style="height:100%;width:' + Math.round((i + 1) / steps.length * 100) + '%;background:var(--terre);transition:width .25s"></div></div>' +
        '<div style="padding:30px 34px;overflow-y:auto;flex:1">' + content + '</div>' +
        '<div style="padding:10px 24px 6px;border-top:1px solid var(--bone-d)">' +
          '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);margin-bottom:5px">📝 Vos notes</div>' +
          '<textarea id="vp-notes" onchange="ADM.visNoteSave(\'' + id + '\',this.value)" placeholder="Notez ce qui se dit pendant l\'appel…" style="width:100%;box-sizing:border-box;min-height:54px;resize:vertical;font-size:15px;line-height:1.5;border:1px solid var(--bone-d);border-radius:8px;padding:8px 10px;font-family:inherit;color:var(--terre)">' + esc(c.notes || '') + '</textarea>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;gap:10px;padding:14px 24px 16px;border-top:1px solid var(--bone-d)">' +
          '<button id="vp-prev" class="btn btn--outline"' + (i === 0 ? ' disabled style="opacity:0.4"' : '') + '>← Précédent</button>' +
          '<button id="vp-next" class="btn btn--dark">' + (i >= steps.length - 1 ? 'Terminer' : 'Suite →') + '</button>' +
        '</div>' +
      '</div>';
      ov.querySelector('#vp-close').onclick = close;
      var pv = ov.querySelector('#vp-prev'); if (pv && i > 0) pv.onclick = function () { i--; render(); };
      ov.querySelector('#vp-next').onclick = function () { if (i >= steps.length - 1) close(); else { i++; render(); } };
    }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(ov);
    render();
  }
  function visAdd(cat) {
    var c = { id: 'v' + Date.now().toString(36), client: '', clientKey: '', category: cat === 'suivi' ? 'suivi' : 'nouveau', date: '', steps: [], questions: [], notes: '', done: false, createdAt: new Date().toISOString() };
    VISIOS.cards.unshift(c); VIS_TAB = 'cards'; visSave(); renderVisiosBody(); visOpen(c.id);
  }
  function visSet(id, field, val) { var c = visCard(id); if (!c) return; c[field] = val; visSave(); renderVisiosBody(); if (field === 'category') renderVisDrawer(); }
  function visNoteSave(id, val) { var c = visCard(id); if (!c) return; c.notes = val; visSave(); }
  function visSetClient(id, key) { var c = visCard(id); if (!c) return; c.clientKey = key || ''; var k = NAV_CLIENTS.filter(function (x) { return x.key === key; })[0]; c.client = k ? clientName(k) : (key ? (c.client || '') : ''); visSave(); renderVisiosBody(); renderVisDrawer(); }
  // Éditeur de trame en texte enrichi (gras, taille, couleur, séparateur).
  // Boutons de mise en forme, partagés par la barre collante et la bulle flottante.
  function visBtns(dark) {
    var col = dark ? '#F2E5C2' : 'var(--terre)';
    var bd = dark ? 'rgba(242,229,194,0.28)' : 'var(--bone-d)';
    var bg = dark ? 'rgba(255,255,255,0.08)' : '#fff';
    var css = 'padding:5px 9px;border:1px solid ' + bd + ';border-radius:7px;background:' + bg + ';cursor:pointer;font-size:13px;color:' + col + ';line-height:1;font-family:inherit';
    function b(cmd, label, title, val) { return '<button type="button" title="' + title + '" onmousedown="event.preventDefault();ADM.visFmt(\'' + cmd + '\'' + (val ? ',\'' + val + '\'' : '') + ')" style="' + css + '">' + label + '</button>'; }
    var sw = ['#412F21', '#c0533b', '#4f6a46', '#6c4ea4', '#c9952f'].map(function (c) { return '<button type="button" title="Couleur du texte" onmousedown="event.preventDefault();ADM.visFmt(\'foreColor\',\'' + c + '\')" style="width:19px;height:19px;border-radius:5px;border:1px solid ' + bd + ';background:' + c + ';cursor:pointer"></button>'; }).join('');
    var sep = '<span style="width:1px;height:16px;background:' + bd + ';margin:0 2px;display:inline-block"></span>';
    return b('bold', '<b>B</b>', 'Gras') + b('italic', '<i>I</i>', 'Italique') + b('underline', '<u>U</u>', 'Souligné') + sep +
      b('fontSize', 'A<span style="font-size:9px;vertical-align:super">+</span>', 'Grand texte', '5') + b('fontSize', 'A', 'Texte normal', '3') + b('fontSize', '<span style="font-size:10px">a</span>', 'Petit texte', '2') + sep +
      b('insertUnorderedList', '• Liste', 'Liste à puces') + b('insertOrderedList', '1. Liste', 'Liste numérotée') + sep +
      sw + sep + b('insertHorizontalRule', '— Séparateur', 'Insérer un séparateur');
  }
  function visRichEditor(domId, html, blurCall, minH) {
    var tb = '<div style="position:sticky;top:0;z-index:6;display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:8px;background:var(--surface-2,#f3ede1);border:1.5px solid var(--bone-d);border-bottom:none;border-radius:10px 10px 0 0">' + visBtns(false) + '<input type="color" onchange="ADM.visFmt(\'foreColor\',this.value)" style="width:26px;height:24px;border:1px solid var(--bone-d);border-radius:5px;padding:1px;cursor:pointer" title="Couleur personnalisée"></div>';
    var ed = '<div id="' + domId + '" contenteditable="true" onblur="' + blurCall + '" onfocus="ADM.visEdActive(this)" onmouseup="ADM.visEdActive(this)" onkeyup="ADM.visEdActive(this)" style="border:1.5px solid var(--bone-d);border-top:none;border-radius:0 0 10px 10px;padding:14px 16px;min-height:' + (minH || 150) + 'px;font-size:16px;line-height:1.7;color:var(--terre);background:#fff;overflow-wrap:anywhere">' + (html || '') + '</div>';
    return '<div>' + tb + ed + '</div>';
  }
  // On mémorise l'éditeur actif et sa sélection : le clic sur un bouton
  // n'entraîne jamais de perte de formatage. Une bulle flottante s'affiche
  // dès qu'on sélectionne du texte, pour formater sans remonter en haut.
  var VIS_ED = null, VIS_RANGE = null, VIS_POP = null, VIS_POP_WIRED = false;
  function visPop() {
    if (VIS_POP) return VIS_POP;
    var d = document.createElement('div');
    d.id = 'vis-pop';
    d.style.cssText = 'position:fixed;z-index:9550;display:none;flex-wrap:wrap;gap:3px;align-items:center;background:var(--nuit,#2a1f16);border-radius:10px;padding:6px;box-shadow:0 10px 30px rgba(0,0,0,0.35);max-width:92vw';
    d.innerHTML = visBtns(true);
    d.addEventListener('mousedown', function (e) { e.preventDefault(); });
    document.body.appendChild(d);
    VIS_POP = d;
    if (!VIS_POP_WIRED) { VIS_POP_WIRED = true; document.addEventListener('scroll', visHidePop, true); document.addEventListener('mousedown', function (e) { if (VIS_POP && VIS_POP.style.display !== 'none' && !VIS_POP.contains(e.target) && !(VIS_ED && VIS_ED.contains(e.target))) visHidePop(); }); }
    return d;
  }
  function visHidePop() { if (VIS_POP) VIS_POP.style.display = 'none'; }
  function visShowPop(range) {
    var r = range.getBoundingClientRect(); if (!r || (!r.width && !r.height)) { visHidePop(); return; }
    var p = visPop(); p.style.display = 'flex';
    var top = r.top - p.offsetHeight - 8; if (top < 8) top = r.bottom + 8;
    var left = r.left + r.width / 2 - p.offsetWidth / 2; left = Math.max(8, Math.min(left, window.innerWidth - p.offsetWidth - 8));
    p.style.top = Math.round(top) + 'px'; p.style.left = Math.round(left) + 'px';
  }
  function visEdActive(elm) {
    VIS_ED = elm;
    var s = window.getSelection && window.getSelection();
    if (s && s.rangeCount && elm.contains(s.anchorNode)) { VIS_RANGE = s.getRangeAt(0); if (!s.isCollapsed) visShowPop(VIS_RANGE); else visHidePop(); }
    else visHidePop();
  }
  function visFmt(cmd, val) {
    if (VIS_ED) { VIS_ED.focus(); if (VIS_RANGE) { try { var s = window.getSelection(); s.removeAllRanges(); s.addRange(VIS_RANGE); } catch (e) {} } }
    try { document.execCommand('styleWithCSS', false, cmd === 'fontSize' || cmd === 'foreColor'); } catch (e) {}
    try { document.execCommand(cmd, false, val == null ? null : val); } catch (e) {}
    var s2 = window.getSelection && window.getSelection(); if (s2 && s2.rangeCount) VIS_RANGE = s2.getRangeAt(0);
    visSaveEditor(VIS_ED);
  }
  function visDel(id) { admConfirm({ title: 'Supprimer cette visio ?', message: 'Son déroulé et ses questions seront supprimés.', yes: 'Supprimer', no: 'Annuler', danger: true }, function () { VISIOS.cards = VISIOS.cards.filter(function (c) { return c.id !== id; }); visCloseDrawer(); visSave(); renderVisiosBody(); }); }
  function visQAdd(id) { var inp = el('vis-q-' + id); var v = inp ? (inp.value || '').trim() : ''; if (!v) return; var c = visCard(id); if (!c) return; if (!Array.isArray(c.questions)) c.questions = []; c.questions.push({ id: 'q' + Date.now().toString(36), text: v, done: false }); visSave(); renderVisiosBody(); renderVisDrawer(); }
  function visQToggle(id, qid) { var c = visCard(id); if (!c) return; (c.questions || []).forEach(function (q) { if (q.id === qid) q.done = !q.done; }); visSave(); }
  function visQSet(id, qid, val) { var c = visCard(id); if (!c) return; (c.questions || []).forEach(function (q) { if (q.id === qid) q.text = val; }); visSave(); }
  function visQDel(id, qid) { var c = visCard(id); if (!c) return; c.questions = (c.questions || []).filter(function (q) { return q.id !== qid; }); visSave(); renderVisiosBody(); renderVisDrawer(); }
  function visApplyTpl(id, tplId) { var c = visCard(id), t = visTpl(tplId); if (!c || !t) return; if (!Array.isArray(c.steps)) c.steps = []; if (!Array.isArray(c.questions)) c.questions = []; (t.steps || []).forEach(function (s, i) { c.steps.push({ id: 's' + Date.now().toString(36) + i, title: s.title || '', html: s.html || '' }); }); (t.questions || []).forEach(function (q, i) { c.questions.push({ id: 'q' + Date.now().toString(36) + i, text: q.text, done: false }); }); visSave(); renderVisiosBody(); renderVisDrawer(); }
  // ── Modèles : un déroulé réutilisable (mêmes étapes) ──
  function visTemplatesHtml() {
    var add = '<div class="row row--end mb"><button class="btn btn--dark btn--sm" onclick="ADM.visTplAdd()">+ Nouveau modèle</button></div>';
    var list = VISIOS.templates.length ? VISIOS.templates.map(visTplHtml).join('') : '<div class="empty">Aucun modèle. Crée un déroulé réutilisable (ex. « Appel découverte ») que tu appliqueras ensuite à tes visios.</div>';
    return add + list;
  }
  function visTplHtml(t) {
    var steps = Array.isArray(t.steps) ? t.steps : [];
    var stepsHtml = steps.map(function (s, idx) {
      return '<div style="border:1px solid var(--bone-d);border-radius:10px;padding:10px 12px;margin-bottom:8px">' +
        '<div class="row" style="gap:8px;align-items:center;margin-bottom:6px">' +
          '<span style="font-family:var(--font-micro);font-size:11px;color:var(--muted);flex-shrink:0">Étape ' + (idx + 1) + '</span>' +
          '<input class="inp" value="' + esc(s.title || '') + '" placeholder="Titre de l\'étape" style="flex:1;font-weight:600" onchange="ADM.visTplStepSet(\'' + t.id + '\',\'' + s.id + '\',\'title\',this.value)">' +
          '<button class="pbtn" title="Monter"' + (idx === 0 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.visTplStepMove(\'' + t.id + '\',\'' + s.id + '\',-1)">↑</button>' +
          '<button class="pbtn" title="Descendre"' + (idx === steps.length - 1 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.visTplStepMove(\'' + t.id + '\',\'' + s.id + '\',1)">↓</button>' +
          '<button class="pbtn" style="color:#c44" onclick="ADM.visTplStepDel(\'' + t.id + '\',\'' + s.id + '\')">×</button>' +
        '</div>' +
        visRichEditor('vistplstep__' + t.id + '__' + s.id, s.html || '', "ADM.visSaveEditor(this)", 110) +
      '</div>';
    }).join('');
    var qs = (t.questions || []).map(function (q) {
      return '<div style="display:flex;align-items:center;gap:8px;padding:3px 0"><input class="inp" value="' + esc(q.text) + '" onchange="ADM.visTplQSet(\'' + t.id + '\',\'' + q.id + '\',this.value)" style="flex:1"><button onclick="ADM.visTplQDel(\'' + t.id + '\',\'' + q.id + '\')" style="background:none;border:none;color:#c44;cursor:pointer;font-size:15px;line-height:1;flex-shrink:0">×</button></div>';
    }).join('');
    return '<div class="card" style="background:var(--card);padding:16px 18px;margin-bottom:12px">' +
      '<div class="row" style="gap:8px;align-items:center"><input class="inp" value="' + esc(t.name || '') + '" placeholder="Nom du modèle (ex. Appel découverte)" style="flex:1;font-weight:600" onchange="ADM.visTplSet(\'' + t.id + '\',\'name\',this.value)"><button class="btn btn--danger btn--sm" onclick="ADM.visTplDel(\'' + t.id + '\')">Suppr.</button></div>' +
      '<div class="between" style="margin:14px 0 8px"><span class="micro">Déroulé</span><button class="btn btn--outline btn--sm" onclick="ADM.visTplStepAdd(\'' + t.id + '\')">+ Étape</button></div>' + stepsHtml +
      '<div class="micro" style="margin:14px 0 5px">Questions</div>' + qs +
      '<div class="row" style="gap:6px;margin-top:6px"><input class="inp" id="vis-tq-' + t.id + '" placeholder="+ Ajouter une question" style="flex:1;min-width:140px" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.visTplQAdd(\'' + t.id + '\');}"><button class="pbtn" onclick="ADM.visTplQAdd(\'' + t.id + '\')">Ajouter</button></div>' +
    '</div>';
  }
  function visTplAdd() { VISIOS.templates.unshift({ id: 't' + Date.now().toString(36), name: '', steps: [], questions: [] }); visSave(); renderVisiosBody(); }
  function visTplSet(id, f, v) { var t = visTpl(id); if (!t) return; t[f] = v; visSave(); }
  function visTplDel(id) { admConfirm({ title: 'Supprimer ce modèle ?', message: 'Il ne sera plus proposé pour tes visios.', yes: 'Supprimer', no: 'Annuler', danger: true }, function () { VISIOS.templates = VISIOS.templates.filter(function (t) { return t.id !== id; }); visSave(); renderVisiosBody(); }); }
  function visTplStepAdd(id) { var t = visTpl(id); if (!t) return; if (!Array.isArray(t.steps)) t.steps = []; t.steps.push({ id: 's' + Date.now().toString(36), title: '', html: '' }); visSave(); renderVisiosBody(); }
  function visTplStepSet(id, sid, f, v) { var t = visTpl(id); if (!t) return; (t.steps || []).forEach(function (s) { if (s.id === sid) s[f] = v; }); visSave(); }
  function visTplStepDel(id, sid) { var t = visTpl(id); if (!t) return; t.steps = (t.steps || []).filter(function (s) { return s.id !== sid; }); visSave(); renderVisiosBody(); }
  function visTplStepMove(id, sid, dir) { var t = visTpl(id); if (!t) return; var a = t.steps || []; var i = a.findIndex(function (s) { return s.id === sid; }); if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return; var tmp = a[i]; a[i] = a[j]; a[j] = tmp; visSave(); renderVisiosBody(); }
  function visTplQAdd(id) { var inp = el('vis-tq-' + id); var v = inp ? (inp.value || '').trim() : ''; if (!v) return; var t = visTpl(id); if (!t) return; if (!Array.isArray(t.questions)) t.questions = []; t.questions.push({ id: 'q' + Date.now().toString(36), text: v }); visSave(); renderVisiosBody(); }
  function visTplQSet(id, qid, v) { var t = visTpl(id); if (!t) return; (t.questions || []).forEach(function (q) { if (q.id === qid) q.text = v; }); visSave(); }
  function visTplQDel(id, qid) { var t = visTpl(id); if (!t) return; t.questions = (t.questions || []).filter(function (q) { return q.id !== qid; }); visSave(); renderVisiosBody(); }

  function renderMyTasks() {
    setMain(topbar('Mes tâches') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    Promise.all([
      api('/api/admin/tasks').then(function (r) { return r.json(); }),
      api('/api/clients').then(function (r) { return r.json(); }).catch(function () { return { clients: [] }; }),
      api('/api/admin/planning').then(function (r) { return r.json(); }).catch(function () { return {}; })
    ]).then(function (res) {
      var d = res[0];
      MT_CLIENTS = (res[1].clients || []).map(function (c) { return { key: c.key, name: (((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.entreprise || c.email || c.key) }; });
      MT_TASKS = d.tasks || [];
      var days = (res[2] && res[2].days) || {};
      var dow = ((new Date().getDay() + 6) % 7) + 1; // 1 = lundi
      MT_TODAY_CAP = days[dow] || 0;
      renderMyTasksBody();
    }).catch(showError);
  }
  // ── Vue Focus : organisée par mode de travail, avec « Aujourd'hui » en tête ──
  function mtToggleToday(id) {
    var t = MT_TASKS.find(function (x) { return x.id === id; }); if (!t) return;
    var nv = mtIsToday(t) ? null : mtTodayIso();
    jpost('/api/admin/tasks/' + id, { doDate: nv }, 'PATCH').then(function (r) { if (!r.ok) { toast('Erreur'); return null; } return r.json(); }).then(function (task) { if (task) { toast(nv ? '📌 Planifiée aujourd\'hui' : 'Retirée d\'aujourd\'hui'); mtApplyLocal(task); } }).catch(function () { toast('Erreur'); });
  }
  function mtSetMode(id, mode) {
    var body = { mode: mode };
    if (mode === 'idee') body.doDate = null; // une idée n'a ni date ni pression
    jpost('/api/admin/tasks/' + id, body, 'PATCH').then(function (r) { if (!r.ok) { toast('Erreur'); return null; } return r.json(); }).then(function (task) { if (task) { var m = mtMode(mode); toast(m ? 'Rangée dans ' + m[2] + ' ' + m[1] : 'Mode retiré'); mtApplyLocal(task); } }).catch(function () { toast('Erreur'); });
  }
  // Menu « Ranger la tâche » : changer le mode (dont Idée) en un clic depuis la ligne.
  function mtMovePick(id) {
    var t = MT_TASKS.find(function (x) { return x.id === id; }); if (!t) return;
    var ov = document.createElement('div'); ov.className = 'admconfirm';
    function btn(key, emoji, label) {
      var on = (t.mode || '') === key;
      return '<button data-mode="' + key + '" style="display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:' + (on ? 'var(--surface-2)' : 'var(--card)') + ';border:1px solid var(--bone-d);border-radius:10px;padding:11px 13px;cursor:pointer;margin-bottom:7px;font-size:14px;color:var(--terre)"><span style="font-size:18px">' + emoji + '</span><span style="flex:1">' + label + '</span>' + (on ? '<span class="micro" style="color:var(--muted)">actuel</span>' : '') + '</button>';
    }
    var opts = MT_MODES.map(function (m) { return btn(m[0], m[2], m[1]); }).join('');
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:400px;text-align:left"><div class="admconfirm__title">Ranger « ' + esc((t.title || '').slice(0, 46)) + ' »</div>' +
      '<div style="margin-top:14px">' + opts + btn('', '🗂', 'À classer (retirer le mode)') + '</div>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    Array.prototype.forEach.call(ov.querySelectorAll('[data-mode]'), function (b) { b.onclick = function () { close(); mtSetMode(id, b.getAttribute('data-mode')); }; });
    document.body.appendChild(ov);
  }
  function mtScrollTo(id) { var e = el(id); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  // Ligne compacte utilisée dans la vue Focus. showMode : afficher la pastille
  // de mode (utile dans « Aujourd'hui » qui mélange les modes).
  function mtFocusRow(t, showMode) {
    var dn = t.status === 'done';
    var today = mtIsToday(t);
    var running = MT_TIMER && MT_TIMER.id === t.id;
    var mins = mtTaskMinutes(t);
    var td = new Date(); td.setHours(0, 0, 0, 0);
    var overdue = !dn && t.dueDate && new Date(t.dueDate) < td;
    var metaBits = [];
    if (mins) metaBits.push(fmtMin(mins));
    if (t.dueDate) metaBits.push((overdue ? 'en retard · ' : 'échéance ') + fmtDate(t.dueDate));
    if (t.impact === 'fort') metaBits.push('⭐ fort');
    var meta = metaBits.join(' · ');
    var subs = Array.isArray(t.subtasks) ? t.subtasks : [];
    var noteMark = ((t.notes && String(t.notes).trim()) || subs.length) ? '📝' + (subs.length ? ' ' + subs.filter(function (s) { return s.done; }).length + '/' + subs.length : '') : '';
    var timerBtn = running
      ? '<button class="pbtn" style="color:var(--orange)" onclick="ADM.mtPause(\'' + t.id + '\')" title="Pause">⏸</button>'
      : '<button class="pbtn" onclick="ADM.mtStart(\'' + t.id + '\')" title="Démarrer le chrono">▶</button>';
    var toggleBtn = today
      ? '<button class="pbtn" title="Retirer d\'aujourd\'hui" onclick="ADM.mtToggleToday(\'' + t.id + '\')">Retirer</button>'
      : '<button class="pbtn" title="Planifier pour aujourd\'hui" onclick="ADM.mtToggleToday(\'' + t.id + '\')">📌 Aujourd\'hui</button>';
    var moveBtn = '<button class="pbtn" title="Ranger (mode / idée)" onclick="ADM.mtMovePick(\'' + t.id + '\')">Ranger</button>';
    return '<div style="display:flex;align-items:center;gap:9px;padding:9px 13px;border-bottom:1px solid var(--bone-d)">' +
      '<input type="checkbox" onchange="ADM.myTaskStatus(\'' + t.id + '\',\'done\')" style="width:17px;height:17px;flex-shrink:0;cursor:pointer" title="Marquer comme fait">' +
      (t.energy ? mtEnergyDot(t.energy) : '') +
      '<span style="flex:1;min-width:0;cursor:pointer;overflow:hidden" onclick="ADM.mtEditOpen(\'' + t.id + '\')">' +
        '<span style="font-size:14px;color:var(--terre)">' + esc(t.title) + '</span>' +
        (showMode && t.mode ? ' ' + mtModePill(t.mode) : '') +
        (meta ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:' + (overdue ? '#a23c28' : 'var(--muted)') + ';margin-left:8px">' + meta + '</span>' : '') +
      '</span>' +
      (t.clientName ? '<span class="micro" title="' + esc(t.clientName) + '" style="flex-shrink:0;text-transform:none;letter-spacing:0;color:var(--glycine-900);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(t.clientName) + '</span>' : '') +
      (noteMark ? '<span style="color:var(--muted);font-size:11px;flex-shrink:0">' + noteMark + '</span>' : '') +
      '<div class="row" style="gap:4px;flex-shrink:0">' + moveBtn + timerBtn + toggleBtn + '</div>' +
    '</div>';
  }
  function mtSectionHead(emoji, label, color, count, hint) {
    return '<div style="display:flex;align-items:baseline;gap:9px;margin:22px 2px 9px">' +
      '<span style="font-family:var(--font-display);font-style:italic;font-size:20px;color:' + color + '">' + emoji + ' ' + esc(label) + '</span>' +
      '<span class="micro" style="color:var(--muted)">' + count + '</span>' +
      (hint ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-left:auto">' + hint + '</span>' : '') +
    '</div>';
  }
  function mtCapacityBar(todayTasks) {
    var planned = todayTasks.reduce(function (s, t) { return s + mtTaskMinutes(t); }, 0);
    var cap = MT_TODAY_CAP;
    if (!cap) {
      return '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:12px;padding:12px 15px;margin-bottom:6px">' +
        '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)"><strong style="color:var(--terre)">' + fmtMin(planned) + '</strong> prévues aujourd\'hui · <a href="javascript:ADM.nav(\'planning\')">règle ta capacité</a> pour voir si ta journée est réaliste.</span></div>';
    }
    var over = planned > cap;
    var pct = Math.min(100, Math.round(planned / cap * 100));
    var barCol = over ? '#a23c28' : (pct >= 80 ? '#c9952f' : '#4f6a46');
    var free = Math.max(0, cap - planned);
    return '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:12px;padding:13px 15px;margin-bottom:6px">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">' +
        '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--terre)"><strong>' + fmtMin(planned) + '</strong> prévues</span>' +
        '<span class="micro" style="text-transform:none;letter-spacing:0;color:' + (over ? '#a23c28' : 'var(--muted)') + '">' + (over ? '+' + fmtMin(planned - cap) + ' au-delà de ta capacité' : fmtMin(free) + ' encore dispo') + '</span>' +
      '</div>' +
      '<div style="height:9px;background:var(--surface-2);border-radius:999px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + barCol + ';border-radius:999px;transition:width .2s"></div></div>' +
      '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:6px">Capacité du jour : ' + fmtMin(cap) + '</div>' +
    '</div>';
  }
  function mtStratChip(n, label, target) {
    return '<button onclick="ADM.mtScrollTo(\'' + target + '\')" style="cursor:pointer;border:1px solid var(--bone-d);background:var(--card);border-radius:12px;padding:10px 14px;text-align:left;min-width:98px;flex:1">' +
      '<div style="font-family:var(--font-display);font-style:italic;font-size:23px;color:' + (n > 0 ? 'var(--terre)' : 'var(--muted)') + ';line-height:1">' + n + '</div>' +
      '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:2px">' + label + '</div></button>';
  }
  function mtFocusView(todo) {
    var today = todo.filter(mtIsToday);
    var rest = todo.filter(function (t) { return !mtIsToday(t); });
    // Fin de la semaine courante (dimanche), pour « cette semaine ».
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + ((7 - now.getDay()) % 7)); weekEnd.setHours(23, 59, 59, 999);
    var weekN = rest.filter(function (t) { if (!t.doDate) return false; var d = new Date(t.doDate); return !isNaN(d) && d > now && d <= weekEnd; }).length;
    var waitingN = rest.filter(function (t) { return !t.doDate && t.mode !== 'idee'; }).length;
    var idees = rest.filter(function (t) { return t.mode === 'idee'; });
    var studioN = rest.filter(function (t) { return t.mode === 'studio'; }).length;
    // Barre stratégique : où mettre ton énergie (pas un simple compteur).
    var strat = '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px">' +
      mtStratChip(today.length, 'Aujourd\'hui', 'mt-sec-today') +
      mtStratChip(weekN, 'Cette semaine', 'mt-sec-today') +
      mtStratChip(waitingN, 'En attente', 'mt-sec-organisation') +
      mtStratChip(studioN, 'Projets', 'mt-sec-studio') +
      mtStratChip(idees.length, 'Idées', 'mt-sec-idee') +
    '</div>';
    // 🎯 Aujourd'hui
    var todaySorted = today.slice().sort(function (a, b) { return mtTaskMinutes(b) - mtTaskMinutes(a); });
    var todayHtml = '<div id="mt-sec-today">' + mtSectionHead('🎯', 'Aujourd\'hui', 'var(--terre)', today.length + (today.length ? ' tâche' + (today.length > 1 ? 's' : '') : ''), '') +
      mtCapacityBar(today) +
      (today.length
        ? '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:13px;overflow:hidden;margin-top:8px">' + todaySorted.map(function (t) { return mtFocusRow(t, true); }).join('') + '</div>'
        : '<div style="border:1px dashed var(--bone-d);border-radius:13px;padding:20px;text-align:center;margin-top:8px"><div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">Rien de prévu aujourd\'hui. Épingle 3 à 5 tâches depuis les sections ci-dessous avec <strong>📌 Aujourd\'hui</strong>.</div></div>') +
    '</div>';
    // Sections par mode (hors aujourd'hui, hors idées)
    var modesHtml = MT_MODES.filter(function (m) { return m[0] !== 'idee'; }).map(function (m) {
      var list = rest.filter(function (t) { return t.mode === m[0]; });
      if (!list.length) return '';
      list.sort(function (a, b) { return String(a.doDate || a.dueDate || '9999').localeCompare(String(b.doDate || b.dueDate || '9999')); });
      return '<div id="mt-sec-' + m[0] + '">' + mtSectionHead(m[2], m[1], m[3], list.length, '') +
        '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:13px;overflow:hidden">' + list.map(function (t) { return mtFocusRow(t, false); }).join('') + '</div></div>';
    }).join('');
    // À classer (sans mode)
    var unclassed = rest.filter(function (t) { return !mtMode(t.mode); });
    var unclassedHtml = unclassed.length ? '<div id="mt-sec-unclassed">' + mtSectionHead('🗂', 'À classer', 'var(--muted)', unclassed.length, 'donne un mode à ces tâches') +
      '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:13px;overflow:hidden">' + unclassed.map(function (t) { return mtFocusRow(t, false); }).join('') + '</div></div>' : '';
    // 💡 Idées
    var ideesHtml = '<div id="mt-sec-idee">' + mtSectionHead('💡', 'Idées', '#8a6f2e', idees.length, 'aucune date, aucune pression') +
      (idees.length
        ? '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:13px;overflow:hidden">' + idees.map(function (t) { return mtFocusRow(t, false); }).join('') + '</div>'
        : '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);padding:4px 2px">Note ici tout ce qui te passe par la tête — via « + Nouveau » → Idée.</div>') +
    '</div>';
    return strat + todayHtml + modesHtml + unclassedHtml + ideesHtml;
  }
  // Menu « Que veux-tu créer ? »
  var MT_CREATE_KIND = 'task';
  function mtCreatePick() {
    var ov = document.createElement('div'); ov.className = 'admconfirm';
    function opt(kind, emoji, label, sub) {
      return '<button data-kind="' + kind + '" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--card);border:1px solid var(--bone-d);border-radius:12px;padding:13px 15px;cursor:pointer;margin-bottom:8px">' +
        '<span style="font-size:22px">' + emoji + '</span><span><span style="display:block;font-weight:600;color:var(--terre)">' + label + '</span><span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">' + sub + '</span></span></button>';
    }
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:420px;text-align:left"><div class="admconfirm__title">Que veux-tu créer ?</div>' +
      '<div style="margin-top:14px">' +
        opt('task', '✅', 'Une tâche', 'Un truc concret à faire, avec un mode et une durée.') +
        opt('idee', '💡', 'Une idée', 'À garder sous le coude — aucune date, aucune pression.') +
        opt('routine', '↻', 'Une routine', 'Une tâche qui revient (chaque jour, semaine ou mois).') +
      '</div><div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    Array.prototype.forEach.call(ov.querySelectorAll('[data-kind]'), function (b) { b.onclick = function () { close(); mtOpenAdd(b.getAttribute('data-kind')); }; });
    document.body.appendChild(ov);
  }
  function mtOpenAdd(kind) { MT_CREATE_KIND = kind || 'task'; MT_ADDOPEN = true; renderMyTasks(); setTimeout(function () { var f = el('mt-title'); if (f) f.focus(); }, 40); }
  // Rendu depuis l'état local (MT_TASKS), sans re-télécharger.
  function renderMyTasksBody() {
      var all = MT_TASKS;
      var todo = all.filter(function (x) { return x.status !== 'done' && !x.archived; });
      var done = all.filter(function (x) { return x.status === 'done' && !x.archived; });
      var archived = all.filter(function (x) { return x.archived; });
      var spentTotal = all.reduce(function (s, x) { return s + (x.timeSpentSeconds || 0); }, 0);
      var prank = { haute: 0, normale: 1, basse: 2 };
      todo.sort(function (a, b) { var pa = prank[a.priority] == null ? 1 : prank[a.priority], pb = prank[b.priority] == null ? 1 : prank[b.priority]; if (pa !== pb) return pa - pb; return String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999')); });
      var estTotal = todo.reduce(function (s, x) { return s + (x.estMinutes || 0); }, 0);
      var weekAgo = new Date(Date.now() - 7 * 86400000);
      var doneWeek = done.filter(function (x) { return x.completedAt && new Date(x.completedAt) >= weekAgo; }).length;
      function kc(n, l, cls) { return '<div class="kpi ' + (cls || '') + '"><div class="kpi__n">' + n + '</div><div class="kpi__l">' + l + '</div></div>'; }
      var kpis = '<div class="kpis">' + kc(todo.length, 'À faire', 'kpi--week') + kc((estTotal / 60).toFixed(1).replace('.0', '') + ' h', 'Temps estimé', 'kpi--today') + kc((spentTotal / 3600).toFixed(1).replace('.0', '') + ' h', 'Temps passé', 'kpi--wait') + kc(doneWeek, 'Fait (7 j)', 'kpi--done') + '</div>';
      var defMode = MT_CREATE_KIND === 'idee' ? 'idee' : '';
      var defRecur = MT_CREATE_KIND === 'routine' ? 'weekly' : '';
      var kindTitle = MT_CREATE_KIND === 'idee' ? 'Nouvelle idée' : (MT_CREATE_KIND === 'routine' ? 'Nouvelle routine' : 'Nouvelle tâche');
      var modeOpts = '<option value="">Mode… (à classer)</option>' + MT_MODES.map(function (m) { return '<option value="' + m[0] + '"' + (defMode === m[0] ? ' selected' : '') + '>' + m[2] + ' ' + m[1] + '</option>'; }).join('');
      var enOpts = '<option value="">Énergie…</option>' + MT_ENERGY.map(function (e) { return '<option value="' + e[0] + '">' + e[1] + ' ' + e[2] + '</option>'; }).join('');
      var impOpts = '<option value="">Impact…</option><option value="faible">Faible</option><option value="moyen">Moyen</option><option value="fort">Fort</option>';
      var recOptsAdd = [['', 'Ne pas répéter'], ['daily', 'Chaque jour'], ['weekly', 'Chaque semaine'], ['monthly', 'Chaque mois']].map(function (o) { return '<option value="' + o[0] + '"' + (defRecur === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var form = MT_ADDOPEN ? '<div class="card"><h3>' + kindTitle + '</h3>' +
        '<div class="row"><input class="inp" id="mt-title" placeholder="Que dois-tu faire ?" style="flex:2;min-width:160px">' +
          '<select class="inp" id="mt-prio" style="width:auto"><option value="haute">Haute</option><option value="normale" selected>Normale</option><option value="basse">Basse</option></select>' +
          '<input class="inp" id="mt-est" type="number" min="0" step="15" placeholder="min" style="width:80px" title="Durée estimée en minutes">' +
          '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0" title="Le jour où tu comptes t\'en occuper">À faire le <input class="inp" id="mt-do" type="date" style="width:auto"></label>' +
          '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0" title="Date limite">Échéance <input class="inp" id="mt-due" type="date" style="width:auto"></label>' +
          '<button class="btn btn--dark" onclick="ADM.myTaskAdd()">Ajouter</button></div>' +
        '<div class="row mt">' +
          '<select class="inp" id="mt-mode" style="flex:1;min-width:150px" title="Mode de travail — l\'axe qui organise ta page">' + modeOpts + '</select>' +
          '<select class="inp" id="mt-energy" style="flex:1;min-width:130px" title="Énergie / durée ressentie">' + enOpts + '</select>' +
          '<select class="inp" id="mt-impact" style="flex:1;min-width:130px" title="Impact">' + impOpts + '</select>' +
        '</div>' +
        '<input class="inp mt" id="mt-notes" placeholder="Note ou lien (optionnel), https://… , détails…" style="width:100%;box-sizing:border-box">' +
        '<input class="inp mt" id="mt-tags" placeholder="Étiquettes séparées par des virgules (ex. Créa, Admin, Perso)" style="width:100%;box-sizing:border-box">' +
        '<div class="row mt">' +
          '<select class="inp" id="mt-client" style="flex:1;min-width:160px"><option value="">Sans client</option>' +
            MT_CLIENTS.map(function (c) { return '<option value="' + esc(c.key) + '">' + esc(c.name) + '</option>'; }).join('') + '</select>' +
          '<select class="inp" id="mt-recur" style="flex:1;min-width:160px" title="Répéter la tâche automatiquement">' + recOptsAdd + '</select>' +
        '</div>' +
        '<div class="micro mt">Le <b>mode</b> range la tâche dans le bon espace de ta page Focus. L\'<b>énergie</b> et la <b>durée</b> servent à savoir si ta journée est réaliste.</div></div>' : '';
      var cols = [['haute', 'Haute', '#b83f29', '#f6f2ea'], ['normale', 'Normale', '#6c4ea4', '#f6f2ea'], ['basse', 'Basse', '#8a7355', '#f6f2ea']];
      var board = '<div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">' + cols.map(function (c) {
        var list = todo.filter(function (t) { return (t.priority || 'normale') === c[0]; });
        return '<div class="mtcol" data-prio="' + c[0] + '" ondragover="ADM.mtDragOver(event)" ondragleave="ADM.mtDragLeave(event)" ondrop="ADM.mtDrop(event,\'' + c[0] + '\')" style="flex:1;min-width:250px;background:' + c[3] + ';border-radius:14px;padding:13px 13px 5px;transition:background 120ms">' +
          '<div style="display:flex;align-items:center;gap:7px;margin-bottom:11px"><span class="pdot" style="background:' + c[2] + '"></span><span style="font-family:var(--font-micro);font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:' + c[2] + '">' + c[1] + '</span><span style="margin-left:auto;font-family:var(--font-micro);font-size:12px;font-weight:700;color:' + c[2] + ';background:#fff;min-width:22px;height:22px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center">' + list.length + '</span></div>' +
          (list.length ? list.map(mtCard).join('') : '<div class="micro" style="padding:14px 2px;color:' + c[2] + ';opacity:0.55;text-align:center">Dépose une tâche ici</div>') +
        '</div>';
      }).join('') + '</div>';
      var doneRev = done.slice().reverse();
      var doneShown = doneRev.slice(0, MT_DONE_LIMIT);
      var doneView = done.length
        ? doneShown.map(mtCard).join('') + (doneRev.length > MT_DONE_LIMIT ? '<div style="text-align:center;margin-top:6px"><button class="btn btn--outline btn--sm" onclick="ADM.mtMoreDone()">Voir plus (' + (doneRev.length - MT_DONE_LIMIT) + ' restantes)</button></div>' : '')
        : '<div class="empty">Aucune tâche terminée pour le moment.</div>';
      var archSorted = archived.slice().sort(function (a, b) { return String(b.completedAt || b.dueDate || '').localeCompare(String(a.completedAt || a.dueDate || '')); });
      var archView = archived.length ? archSorted.map(mtCard).join('') : '<div class="empty">Aucune tâche archivée. Archivez une tâche terminée pour la ranger ici.</div>';
      var viewTabs = '<div class="subtabs"><button class="subtab' + (MT_VIEW === 'focus' ? ' active' : '') + '" onclick="ADM.mtSetView(\'focus\')">🎯 Focus</button>' +
        '<button class="subtab' + (MT_VIEW === 'list' ? ' active' : '') + '" onclick="ADM.mtSetView(\'list\')">Liste · ' + todo.length + '</button>' +
        '<button class="subtab' + (MT_VIEW === 'board' ? ' active' : '') + '" onclick="ADM.mtSetView(\'board\')">Tableau · ' + todo.length + '</button>' +
        '<button class="subtab' + (MT_VIEW === 'done' ? ' active' : '') + '" onclick="ADM.mtSetView(\'done\')">Terminées · ' + done.length + '</button>' +
        '<button class="subtab' + (MT_VIEW === 'archived' ? ' active' : '') + '" onclick="ADM.mtSetView(\'archived\')">Archivées · ' + archived.length + '</button></div>';
      var boardHint = todo.length ? '<div class="micro" style="margin:-6px 0 14px">Glisse une tâche d\'une colonne à l\'autre pour changer sa priorité.</div>' : '';
      var tagSet = {}; todo.forEach(function (t) { (Array.isArray(t.tags) ? t.tags : []).forEach(function (tg) { tagSet[tg] = (tagSet[tg] || 0) + 1; }); });
      var allTags = Object.keys(tagSet).sort(function (a, b) { return a.localeCompare(b); });
      if (MT_TAG !== 'all' && !tagSet[MT_TAG]) MT_TAG = 'all';
      function tagChip(v, lbl, active) {
        var c = v === 'all' ? ['var(--surface-2)', 'var(--terre)'] : mtTagColor(v);
        return '<button onclick="ADM.mtSetTag(\'' + (v === 'all' ? 'all' : String(v).replace(/'/g, "\\'")) + '\')" style="cursor:pointer;border:none;font-family:var(--font-micro);font-size:10px;letter-spacing:0.04em;text-transform:uppercase;padding:5px 12px;border-radius:999px;background:' + (active ? c[1] : c[0]) + ';color:' + (active ? '#fff' : c[1]) + ';' + (active ? '' : 'opacity:0.9;') + '">' + esc(lbl) + '</button>';
      }
      var tagChips = allTags.length ? '<div style="display:flex;flex-wrap:wrap;gap:7px;margin:-2px 0 15px">' + tagChip('all', 'Toutes', MT_TAG === 'all') + allTags.map(function (tg) { return tagChip(tg, tg + ' · ' + tagSet[tg], MT_TAG === tg); }).join('') + '</div>' : '';
      var boardShown = board;
      if (MT_TAG !== 'all') {
        boardShown = '<div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">' + cols.map(function (c) {
          var list = todo.filter(function (t) { return (t.priority || 'normale') === c[0] && Array.isArray(t.tags) && t.tags.indexOf(MT_TAG) !== -1; });
          return '<div class="mtcol" data-prio="' + c[0] + '" ondragover="ADM.mtDragOver(event)" ondragleave="ADM.mtDragLeave(event)" ondrop="ADM.mtDrop(event,\'' + c[0] + '\')" style="flex:1;min-width:250px;background:' + c[3] + ';border-radius:14px;padding:13px 13px 5px;transition:background 120ms">' +
            '<div style="display:flex;align-items:center;gap:7px;margin-bottom:11px"><span class="pdot" style="background:' + c[2] + '"></span><span style="font-family:var(--font-micro);font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:' + c[2] + '">' + c[1] + '</span><span style="margin-left:auto;font-family:var(--font-micro);font-size:12px;font-weight:700;color:' + c[2] + ';background:#fff;min-width:22px;height:22px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center">' + list.length + '</span></div>' +
            (list.length ? list.map(mtCard).join('') : '<div class="micro" style="padding:14px 2px;color:' + c[2] + ';opacity:0.55;text-align:center">Aucune tâche</div>') +
          '</div>';
        }).join('') + '</div>';
      }
      var quickBar = '<div style="margin-bottom:14px"><div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<input class="inp" id="mt-quick" placeholder="Ajout rapide… (ex. Relancer Émilie #Admin !)" style="flex:1;min-width:180px" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.mtQuickAdd();}">' +
        '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0" title="Le jour où tu comptes t\'en occuper">À faire le <input class="inp" id="mt-quick-do" type="date" style="width:auto"></label>' +
        '<button class="btn btn--dark" onclick="ADM.mtQuickAdd()">Ajouter</button></div>' +
        '<div class="micro" style="margin-top:6px">Astuce : ajoutez <b>#étiquette</b> pour classer, un <b>!</b> pour la priorité haute, et une date <b>« À faire le »</b> si tu veux la planifier. « + Nouvelle tâche » ouvre le détail (client, échéance, récurrence…).</div></div>';
      var boardContent = MT_VIEW === 'board' ? quickBar + (todo.length ? tagChips + boardHint + boardShown : '<div class="empty">Aucune tâche en cours. Ajoutes-en une ci-dessus.</div>') : '';
      // Vue Liste (checklist) : tout à faire, à cocher, avec ajout en masse.
      var prank2 = { haute: 0, normale: 1, basse: 2 };
      var listSorted = todo.slice().sort(function (a, b) {
        var pa = prank2[a.priority] == null ? 1 : prank2[a.priority], pb = prank2[b.priority] == null ? 1 : prank2[b.priority];
        if (pa !== pb) return pa - pb;
        return String(a.doDate || a.dueDate || '9999').localeCompare(String(b.doDate || b.dueDate || '9999'));
      });
      var bulkBtn = '<div style="margin-bottom:12px"><button class="btn btn--outline btn--sm" onclick="ADM.mtBulkAddOpen()">🧠 Vider ton cerveau · coller une liste</button></div>';
      var listView = quickBar + bulkBtn + (todo.length ? '<div class="card" style="padding:4px 0">' + listSorted.map(mtListRow).join('') + '</div>' : '<div class="empty">Aucune tâche en cours. Ajoutes-en une ci-dessus, ou colle une liste.</div>');
      var focusContent = MT_VIEW === 'focus' ? mtFocusView(todo) : '';
      var content = MT_VIEW === 'focus' ? focusContent : (MT_VIEW === 'list' ? listView : (MT_VIEW === 'done' ? doneView : (MT_VIEW === 'archived' ? archView : boardContent)));
      var addBtn = MT_ADDOPEN
        ? '<button class="btn btn--dark btn--sm" onclick="ADM.mtToggleAdd()">Fermer</button>'
        : '<button class="btn btn--dark btn--sm" onclick="ADM.mtCreatePick()">+ Nouveau</button>';
      var head = MT_VIEW === 'focus' ? '' : kpis;
      setMain(topbar('Mes tâches', addBtn, 'Ton organisation personnelle, séparée des espaces clients') + '<div class="wrap" style="max-width:1200px">' + head + form + viewTabs + content + '</div>');
  }
  function myTaskAdd() {
    var title = (el('mt-title').value || '').trim(); if (!title) { toast('Titre requis'); return; }
    var tags = (el('mt-tags') ? el('mt-tags').value : '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var ck = el('mt-client') ? el('mt-client').value : '';
    var cn = ''; if (ck) { for (var i = 0; i < MT_CLIENTS.length; i++) { if (MT_CLIENTS[i].key === ck) { cn = MT_CLIENTS[i].name; break; } } }
    var mode = el('mt-mode') ? el('mt-mode').value : '';
    var energy = el('mt-energy') ? el('mt-energy').value : '';
    var impact = el('mt-impact') ? el('mt-impact').value : '';
    jpost('/api/admin/tasks', { title: title, priority: el('mt-prio').value, estMinutes: el('mt-est').value, doDate: el('mt-do').value || null, dueDate: el('mt-due').value || null, notes: (el('mt-notes').value || '').trim(), tags: tags, clientKey: ck, clientName: cn, recurrence: el('mt-recur') ? el('mt-recur').value : '', mode: mode, energy: energy, impact: impact }).then(function (r) { if (!r.ok) { toast('Erreur'); return null; } return r.json(); }).then(function (task) { if (task) { MT_ADDOPEN = false; toast('Ajouté'); mtApplyLocal(task); } }).catch(function () { toast('Erreur'); });
  }
  function myTaskStatus(id, st) { if (st === 'done' && MT_TIMER && MT_TIMER.id === id) mtPause(id, true); jpost('/api/admin/tasks/' + id, { status: st }, 'PATCH').then(function (r) { if (!r.ok) { toast('Erreur'); return null; } return r.json(); }).then(function (task) { if (task) mtApplyLocal(task); }).catch(function () { toast('Erreur'); }); }
  function myTaskDel(id) {
    admConfirm({ title: 'Supprimer cette tâche ?', message: 'La tâche et son temps passé seront supprimés.', yes: 'Oui, supprimer', no: 'Non', danger: true }, function () {
      api('/api/admin/tasks/' + id, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Supprimée'); MT_TASKS = MT_TASKS.filter(function (x) { return x.id !== id; }); if (VIEW === 'mytasks') renderMyTasksBody(); } else toast('Erreur'); });
    });
  }
  function myTaskArchive(id, val) { if (val && MT_TIMER && MT_TIMER.id === id) mtPause(id, true); jpost('/api/admin/tasks/' + id, { archived: !!val }, 'PATCH').then(function (r) { if (!r.ok) { toast('Erreur'); return null; } return r.json(); }).then(function (task) { if (task) { toast(val ? 'Tâche archivée' : 'Tâche restaurée'); mtApplyLocal(task); } }).catch(function () { toast('Erreur'); }); }

  /* ── Calendrier intelligent (planning hebdo) ── */
  var PLAN_TASKS = [], PLAN_CAP = {}, PLAN_START = 9.5, PLAN_END = 18, PLAN_LUNCH_START = 13, PLAN_LUNCH_END = 14, PLAN_BLOCKS = [], PLAN_SEQ = 0;
  var DOW_LBL = { 1: 'Lun', 2: 'Mar', 3: 'Mer', 4: 'Jeu', 5: 'Ven', 6: 'Sam', 7: 'Dim' };
  function planIso(dt) { var m = dt.getMonth() + 1, da = dt.getDate(); return dt.getFullYear() + '-' + ('0' + m).slice(-2) + '-' + ('0' + da).slice(-2); }
  function planWeek(tasks, cap, blocks, startHour) {
    startHour = startHour || 9;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var days = [];
    // Fenêtre glissante des 5 prochains jours OUVRÉS (lun-ven), à partir d'aujourd'hui
    var cur = new Date(now);
    while (days.length < 5) {
      var k = ((cur.getDay() + 6) % 7) + 1;
      if (k <= 5) {
        var dt = new Date(cur); var ds = planIso(dt);
        var winStart = startHour * 60, winEnd = startHour * 60 + (cap[k] || 0);
        var fixed = (blocks || []).filter(function (b) { return b.dow === k; }).map(function (b) { return { type: 'block', id: b.id, start: b.start, end: b.start + b.duration, duration: b.duration, label: b.label, color: b.color }; }).sort(function (a, b) { return a.start - b.start; });
        days.push({ date: dt, dow: k, ds: ds, cap: (cap[k] || 0), winStart: winStart, winEnd: winEnd, fixed: fixed, items: [], used: 0, today: ds === planIso(now) });
      }
      cur.setDate(cur.getDate() + 1);
    }
    // créneaux libres = fenêtre du jour moins les blocs fixes ET la pause déjeuner
    var lunchS = Math.round(PLAN_LUNCH_START * 60), lunchE = Math.round(PLAN_LUNCH_END * 60);
    days.forEach(function (d) {
      var blocked = d.fixed.map(function (b) { return [Math.max(d.winStart, Math.min(b.start, d.winEnd)), Math.max(d.winStart, Math.min(b.end, d.winEnd))]; });
      if (lunchE > lunchS && lunchS < d.winEnd && lunchE > d.winStart) blocked.push([Math.max(d.winStart, lunchS), Math.min(d.winEnd, lunchE)]);
      blocked.sort(function (a, b) { return a[0] - b[0]; });
      d.free = []; var cursor = d.winStart;
      blocked.forEach(function (iv) { if (iv[1] <= iv[0]) return; if (iv[0] > cursor) d.free.push([cursor, iv[0]]); cursor = Math.max(cursor, iv[1]); });
      if (cursor < d.winEnd) d.free.push([cursor, d.winEnd]);
    });
    var prank = { haute: 0, normale: 1, basse: 2 };
    var todo = tasks.filter(function (x) { return x.status !== 'done'; }).slice().sort(function (a, b) { var pa = prank[a.priority] == null ? 1 : prank[a.priority], pb = prank[b.priority] == null ? 1 : prank[b.priority]; if (pa !== pb) return pa - pb; return String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999')); });
    var overflow = [];
    todo.forEach(function (t) {
      var est = t.estMinutes || 30; var placed = false;
      for (var i = 0; i < days.length && !placed; i++) {
        var d = days[i]; if (d.cap <= 0) continue;
        if (t.dueDate) { var dd = new Date(t.dueDate); dd.setHours(0, 0, 0, 0); if (d.date > dd) break; }
        for (var s = 0; s < d.free.length; s++) { var seg = d.free[s]; if (seg[1] - seg[0] >= est) { d.items.push({ type: 'task', task: t, start: seg[0], end: seg[0] + est, duration: est }); seg[0] += est; d.used += est; placed = true; break; } }
      }
      if (!placed) overflow.push(t);
    });
    days.forEach(function (d) { d.all = d.fixed.concat(d.items).sort(function (a, b) { return a.start - b.start; }); });
    return { days: days, overflow: overflow };
  }
  function planTaskPill(t) {
    var pcol = { haute: 'var(--red)', normale: 'var(--glycine-900)', basse: '#c3b9a6' }[t.priority] || 'var(--glycine-900)';
    var est = t.estMinutes ? ((t.estMinutes / 60).toFixed(1).replace('.0', '') + ' h') : '';
    return '<div style="display:flex;align-items:flex-start;gap:6px;background:var(--card);border:1px solid var(--bone-d);border-radius:8px;padding:7px 9px;margin-bottom:6px">' +
      '<span class="pdot" style="background:' + pcol + ';margin-top:5px;flex-shrink:0"></span>' +
      '<div style="flex:1;min-width:0"><div style="font-size:12.5px;color:var(--terre);line-height:1.3">' + esc(t.title) + '</div>' + (est ? '<div class="micro" style="color:var(--muted)">' + est + '</div>' : '') + '</div>' +
      '<button class="pbtn pbtn--ok" style="padding:3px 7px;font-size:9px" onclick="ADM.planDone(\'' + t.id + '\')" title="Marquer fait">✓</button></div>';
  }
  function planHM(min) { var h = Math.floor(min / 60), m = min % 60; return h + 'h' + (m ? ('0' + m).slice(-2) : ''); }
  function planDayCol(d, startMin, endMin, PXMIN) {
    var colH = (endMin - startMin) * PXMIN;
    var lines = '';
    for (var hm = Math.ceil(startMin / 60) * 60; hm < endMin; hm += 60) { lines += '<div style="position:absolute;left:0;right:0;top:' + ((hm - startMin) * PXMIN) + 'px;border-top:1px solid #e0d4bd"></div>'; }
    var capEnd = startMin + d.cap;
    var capLine = (d.cap > 0 && capEnd < endMin) ? '<div style="position:absolute;left:0;right:0;top:' + ((capEnd - startMin) * PXMIN) + 'px;border-top:2px dashed #d8b06a"></div>' : '';
    var lunchBand = '';
    var ls0 = Math.round(PLAN_LUNCH_START * 60), le0 = Math.round(PLAN_LUNCH_END * 60);
    if (le0 > ls0 && le0 > startMin && ls0 < endMin) {
      var ls = Math.max(startMin, ls0), le = Math.min(endMin, le0);
      lunchBand = '<div title="Pause déjeuner" style="position:absolute;left:0;right:0;top:' + ((ls - startMin) * PXMIN) + 'px;height:' + ((le - ls) * PXMIN) + 'px;background:#ece6da;display:flex;align-items:center;justify-content:center"><span style="font-size:9px;color:#a89a86;letter-spacing:0.05em">Pause déjeuner</span></div>';
    }
    var bg = d.cap <= 0 ? '#faf7f1' : (d.today ? '#fbf7ff' : 'var(--card)');
    if (d.cap <= 0 && !d.fixed.length) { return '<div style="position:relative;height:' + colH + 'px;background:' + bg + '">' + lines + lunchBand + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#cabfa9;font-size:11px">repos</div></div>'; }
    var items = '';
    d.all.forEach(function (it) {
      var top = (it.start - startMin) * PXMIN, bh = Math.max(22, it.duration * PXMIN), hrs = planHM(it.start) + ' à ' + planHM(it.end);
      if (it.type === 'block') {
        var linkHtml = (it.link && bh > 46) ? '<a href="' + esc(it.link) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="color:#fff;font-size:9px;text-decoration:underline;display:block;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">↗ Rejoindre la visio</a>' : '';
        items += '<div title="' + esc(it.label || 'Bloc') + ', ' + hrs + (it.link ? ', visio' : '') + '" style="position:absolute;left:3px;right:3px;top:' + top + 'px;height:' + (bh - 2) + 'px;background:' + it.color + ';border-radius:7px;padding:4px 7px;overflow:hidden;box-sizing:border-box;color:#fff">' +
          '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:4px"><span style="font-size:11px;font-weight:600;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (it.link ? '◉ ' : '') + esc(it.label || 'Bloc') + '</span><span onclick="ADM.planBlockDel(\'' + it.id + '\')" title="Supprimer ce bloc" style="cursor:pointer;color:rgba(255,255,255,0.85);font-size:11px;line-height:1;flex-shrink:0">✕</span></div>' +
          (bh > 34 ? '<div style="font-size:9px;opacity:0.9;margin-top:1px">' + hrs + '</div>' : '') + linkHtml + '</div>';
      } else {
        var t = it.task;
        var pcol = { haute: '#b83f29', normale: '#6c4ea4', basse: '#8a7355' }[t.priority] || '#6c4ea4';
        var lbg = { haute: '#f5c3b2', normale: '#d6c2f1', basse: '#e6dac2' }[t.priority] || '#d6c2f1';
        var ptx = { haute: '#7a2615', normale: '#42316b', basse: '#5d4c36' }[t.priority] || '#42316b';
        items += '<div title="' + esc(t.title) + '" style="position:absolute;left:3px;right:3px;top:' + top + 'px;height:' + (bh - 2) + 'px;background:' + lbg + ';border:1px solid rgba(65,47,33,0.18);border-radius:7px;padding:4px 7px;overflow:hidden;box-sizing:border-box">' +
          '<div style="display:flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:' + pcol + ';flex-shrink:0"></span><span style="font-size:11px;font-weight:700;color:' + ptx + ';line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0">' + esc(t.title) + '</span>' +
            '<button onclick="event.stopPropagation();ADM.planDone(\'' + t.id + '\')" title="Marquer fait" style="flex-shrink:0;background:rgba(255,255,255,0.65);border:none;border-radius:5px;cursor:pointer;font-size:10px;line-height:1;padding:2px 5px;color:' + ptx + '">✓</button></div>' +
          (bh > 34 ? '<div style="font-size:9px;color:' + ptx + ';opacity:0.75;margin-top:1px">' + hrs + '</div>' : '') + '</div>';
      }
    });
    return '<div style="position:relative;height:' + colH + 'px;background:' + bg + '">' + lines + lunchBand + capLine + items + '</div>';
  }
  function renderPlanningView() {
    var startHour = PLAN_START || 9.5, endHour = PLAN_END || 18, PXMIN = 0.85;
    var plan = planWeek(PLAN_TASKS, PLAN_CAP, PLAN_BLOCKS, startHour);
    var startMin = Math.round(startHour * 60), endMin = Math.round(endHour * 60);
    // élargit la fenêtre si un bloc déborde des horaires affichés
    plan.days.forEach(function (d) { d.fixed.forEach(function (b) { if (b.start < startMin) startMin = Math.floor(b.start / 60) * 60; if (b.end > endMin) endMin = Math.ceil(b.end / 60) * 60; }); });
    var colH = (endMin - startMin) * PXMIN;
    var todoCount = PLAN_TASKS.filter(function (x) { return x.status !== 'done'; }).length;
    var placedCount = plan.days.reduce(function (s, d) { return s + d.items.length; }, 0);
    var hasCap = [1, 2, 3, 4, 5, 6, 7].some(function (k) { return (PLAN_CAP[k] || 0) > 0; });
    var noEst = PLAN_TASKS.filter(function (x) { return x.status !== 'done' && !x.estMinutes; }).length;
    // Mode d'emploi en 3 étapes
    var guide = '<div class="card"><h3>Comment ça marche</h3>' +
      '<div style="display:flex;flex-wrap:wrap;gap:14px">' +
      planStep(1, 'Indique tes heures dispo', 'Pour chaque jour, le nombre d\'heures que tu peux consacrer à tes tâches (ci-dessous).') +
      planStep(2, 'Donne une durée à tes tâches', 'Dans « Mes tâches », ajoute une durée estimée (en minutes). Sans durée, la tâche compte 30 min.') +
      planStep(3, 'Pose tes blocs fixes', 'Réserve des créneaux (rendez-vous, créa, pause). Tes tâches se placent automatiquement dans le temps libre restant.') +
      planStep(4, 'Le planning se construit seul', 'Tout se range sur la semaine (lun-ven), par priorité puis par échéance. Clique une tâche pour la marquer faite.') +
      '</div></div>';
    var nudges = '';
    if (!hasCap) nudges += '<div class="card" style="background:#fbf3e0"><strong>Commence ici</strong><div class="micro mt">Renseigne tes heures disponibles par jour juste en dessous. Tant que tout est à 0, aucune tâche ne peut être placée.</div></div>';
    if (todoCount === 0) nudges += '<div class="card"><strong>Aucune tâche à planifier</strong><div class="micro mt mb">Ajoute des tâches avec une durée estimée pour les voir se placer ici.</div><button class="btn btn--dark btn--sm" onclick="ADM.nav(\'mytasks\')">Aller à Mes tâches</button></div>';
    else if (hasCap && placedCount === 0 && plan.overflow.length) nudges += '<div class="card" style="background:#fbf3e0"><strong>Rien n\'a pu être casé</strong><div class="micro mt">Tes échéances sont peut-être déjà passées, ou tes heures dispo trop justes. Augmente tes heures ou repousse les échéances dans « Mes tâches ».</div></div>';
    var capEditor = '<div class="card"><h3>Tes disponibilités</h3><div class="row" style="flex-wrap:wrap;gap:10px;align-items:flex-end">' +
      '<label style="display:flex;flex-direction:column;font-family:var(--font-micro);font-size:10px;color:var(--muted);gap:3px">Début de journée<input class="inp" type="number" min="5" max="20" step="0.5" style="width:90px" value="' + startHour + '" onchange="ADM.planStart(this.value)"></label>' +
      '<label style="display:flex;flex-direction:column;font-family:var(--font-micro);font-size:10px;color:var(--muted);gap:3px">Fin de journée<input class="inp" type="number" min="6" max="23" step="0.5" style="width:90px" value="' + endHour + '" onchange="ADM.planEnd(this.value)"></label>' +
      '<span style="width:1px;height:34px;background:var(--bone-d)"></span>' +
      '<label style="display:flex;flex-direction:column;font-family:var(--font-micro);font-size:10px;color:var(--muted);gap:3px">Pause de<input class="inp" type="number" min="0" max="22" step="0.5" style="width:78px" value="' + PLAN_LUNCH_START + '" onchange="ADM.planLunch(\'start\',this.value)"></label>' +
      '<label style="display:flex;flex-direction:column;font-family:var(--font-micro);font-size:10px;color:var(--muted);gap:3px">à<input class="inp" type="number" min="0" max="23" step="0.5" style="width:78px" value="' + PLAN_LUNCH_END + '" onchange="ADM.planLunch(\'end\',this.value)"></label>' +
      '<span style="width:1px;height:34px;background:var(--bone-d)"></span>' +
      [1, 2, 3, 4, 5].map(function (k) { return '<label style="display:flex;flex-direction:column;font-family:var(--font-micro);font-size:10px;color:var(--muted);gap:3px">' + DOW_LBL[k] + ' (h travail)<input class="inp" type="number" min="0" max="14" step="0.5" style="width:62px" value="' + ((PLAN_CAP[k] || 0) / 60) + '" onchange="ADM.planCap(' + k + ',this.value)"></label>'; }).join('') +
      '</div><div class="micro mt">Le calendrier affiche toute la journée (' + planHM(startMin) + ' à ' + planHM(endMin) + '). Les heures de travail par jour limitent ce que l\'on case (ligne pointillée). Mettez 0 pour un jour de repos.' + (noEst ? ' ' + noEst + ' tâche(s) sans durée estimée comptent 30 min.' : '') + '</div></div>';
    var axis = ''; for (var hm = Math.ceil(startMin / 60) * 60; hm <= endMin; hm += 60) { axis += '<div style="position:absolute;top:' + ((hm - startMin) * PXMIN) + 'px;right:6px;font-size:9px;color:var(--muted);transform:translateY(-50%);font-family:var(--font-micro)">' + (hm / 60) + 'h</div>'; }
    var axisCol = '<div style="width:42px;flex-shrink:0;position:relative;height:' + colH + 'px">' + axis + '</div>';
    var headRow = '<div style="display:flex"><div style="width:38px;flex-shrink:0"></div>' + plan.days.map(function (dday) {
      var over = dday.used > dday.cap;
      return '<div style="flex:1;min-width:140px;padding:0 4px 8px;text-align:center' + (dday.today ? ';background:#f3ecff;border-radius:8px 8px 0 0' : '') + '"><div style="font-family:var(--font-display);font-style:italic;font-size:16px;color:var(--terre)">' + DOW_LBL[dday.dow] + ' ' + dday.date.getDate() + '</div>' +
        (dday.today ? '<div class="micro" style="color:var(--terre);font-weight:700">Aujourd\'hui</div>' : '') +
        (dday.cap > 0 ? '<div class="micro" style="color:' + (over ? 'var(--red)' : 'var(--muted)') + '">' + (dday.used / 60).toFixed(1).replace('.0', '') + ' / ' + (dday.cap / 60).toFixed(1).replace('.0', '') + ' h</div>' : '') +
        '<button onclick="ADM.planTaskForm(\'' + dday.ds + '\')" title="Ajouter une tâche pour ce jour" style="margin-top:3px;background:none;border:1px solid var(--bone-d);border-radius:6px;color:var(--terre-400);cursor:pointer;font-size:11px;line-height:1;padding:3px 9px">+ tâche</button></div>';
    }).join('') + '</div>';
    var bodyRow = '<div style="display:flex;align-items:stretch;border:1px solid var(--bone-d);border-radius:12px;padding:14px 0 16px">' + axisCol + plan.days.map(function (dday) { return '<div style="flex:1;min-width:140px;border-left:1px solid var(--bone-d)">' + planDayCol(dday, startMin, endMin, PXMIN) + '</div>'; }).join('') + '</div>';
    var fld = 'display:flex;flex-direction:column;font-family:var(--font-micro);font-size:10px;color:var(--muted);gap:3px';
    var DOW_FULL = { 1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi' };
    var dayOpts = [1, 2, 3, 4, 5].map(function (k) { return '<option value="' + k + '"' + (plan.days[0].dow === k ? ' selected' : '') + '>' + DOW_FULL[k] + '</option>'; }).join('');
    var groups = planGroups();
    var typeOpts = '<option value="__new__">Nouveau bloc…</option>' + groups.map(function (g) { return '<option value="' + g.groupId + '">' + esc(g.label || 'Bloc') + '</option>'; }).join('');
    var swatches = DA_BANNER.map(function (c) { return '<button type="button" onclick="document.getElementById(\'blk-color\').value=\'' + c[0] + '\'" title="' + c[1] + '" style="width:20px;height:20px;border-radius:5px;cursor:pointer;background:' + c[0] + ';border:1px solid var(--bone-d)"></button>'; }).join('');
    var modelsList = groups.length ? '<div class="micro" style="margin-top:16px;margin-bottom:6px;font-weight:600;color:var(--terre);text-transform:uppercase;letter-spacing:0.04em">Tes modèles de blocs</div>' +
      groups.map(function (g) {
        return '<div class="file"><span class="nm" style="display:flex;align-items:center;gap:10px">' +
          '<input type="color" value="' + g.color + '" onchange="ADM.planGroupColor(\'' + g.groupId + '\',this.value)" title="Couleur (appliquée à toutes les occurrences)" style="width:30px;height:24px;border:1px solid var(--bone-d);border-radius:6px;padding:1px;cursor:pointer">' +
          esc(g.label || 'Bloc') + ' <span class="micro muted">' + g.count + ' fois</span></span>' +
          '<button class="btn btn--danger btn--sm" onclick="ADM.planGroupDel(\'' + g.groupId + '\')">Tout retirer</button></div>';
      }).join('') : '';
    var blockEditor = '<div class="card"><h3>Tes blocs de temps</h3>' +
      '<div class="micro mb">Réserve des créneaux récurrents (rendez-vous, créa, pause) qui reviennent chaque semaine le même jour. Tes tâches se placent automatiquement autour. Repose un même modèle plusieurs fois, ils restent liés.</div>' +
      '<div class="row" style="flex-wrap:wrap;gap:8px;align-items:flex-end">' +
        '<label style="' + fld + '">Type<select class="inp" id="blk-type" style="width:auto" onchange="ADM.planTypeChange()">' + typeOpts + '</select></label>' +
        '<label style="' + fld + '">Jour<select class="inp" id="blk-day" style="width:auto">' + dayOpts + '</select></label>' +
        '<label style="' + fld + '">Heure<input class="inp" type="time" id="blk-time" value="09:00" style="width:auto"></label>' +
        '<label style="' + fld + '">Durée (min)<input class="inp" type="number" id="blk-dur" min="5" max="720" step="5" value="60" style="width:78px"></label>' +
        '<label style="' + fld + ';flex:1;min-width:140px" id="blk-label-wrap">Intitulé / motif<input class="inp" id="blk-label" placeholder="Rendez-vous, créa, pause"></label>' +
        '<label style="' + fld + ';flex:1;min-width:160px">Lien visio (optionnel)<input class="inp" id="blk-link" placeholder="https://meet… ou zoom…"></label>' +
        '<label style="' + fld + '" id="blk-color-wrap">Couleur<span class="row" style="gap:5px;align-items:center"><input type="color" id="blk-color" value="#8B6F52" style="width:34px;height:26px;border:1px solid var(--bone-d);border-radius:6px;padding:1px;cursor:pointer">' + swatches + '</span></label>' +
        '<button class="btn btn--dark btn--sm" onclick="ADM.planBlockAdd()">+ Ajouter</button>' +
      '</div>' + modelsList + '</div>';
    var ctaForm = '<div id="cta-form" style="display:none;background:var(--surface);border:1px solid var(--bone-d);border-radius:10px;padding:12px 14px;margin-bottom:12px">' +
      '<div class="row" style="flex-wrap:wrap;gap:8px;align-items:flex-end">' +
        '<label style="' + fld + ';flex:1;min-width:170px">Tâche<input class="inp" id="cta-title" placeholder="Que dois-tu faire ?"></label>' +
        '<label style="' + fld + '">Priorité<select class="inp" id="cta-prio" style="width:auto"><option value="haute">Haute</option><option value="normale" selected>Normale</option><option value="basse">Basse</option></select></label>' +
        '<label style="' + fld + '">Durée (min)<input class="inp" id="cta-est" type="number" min="0" step="15" value="30" style="width:80px"></label>' +
        '<label style="' + fld + '">Échéance<input class="inp" id="cta-due" type="date" style="width:auto"></label>' +
        '<button class="btn btn--dark btn--sm" onclick="ADM.planTaskAdd()">Ajouter</button>' +
        '<button class="btn btn--outline btn--sm" onclick="ADM.planTaskForm()">Fermer</button>' +
      '</div><div class="micro mt">La tâche se place automatiquement dans un créneau libre, selon sa priorité et son échéance.</div></div>';
    var cal = '<div class="card"><div class="between"><h3>Ta semaine</h3><div class="row" style="gap:10px;align-items:center"><span class="micro" style="color:var(--muted)">' + planHM(startMin) + ' à ' + planHM(endMin) + '</span><button class="btn btn--dark btn--sm" onclick="ADM.planTaskForm()">+ Tâche</button></div></div>' + ctaForm + '<div style="overflow-x:auto;padding-bottom:4px">' + headRow + bodyRow + '</div></div>';
    var overflowHtml = plan.overflow.length ? '<div class="card mt"><h3>Non casé cette semaine <span class="micro" style="color:var(--muted)">· ' + plan.overflow.length + '</span></h3><div class="micro mb">Pas assez de créneaux libres, ou échéance déjà passée. Augmente tes heures, retire un bloc, ou reporte ces tâches.</div>' + plan.overflow.map(planTaskPill).join('') + '</div>' : '';
    var settings = '<details class="card mt"><summary style="cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--terre);list-style:none">Réglages, blocs et mode d\'emploi</summary><div class="mt">' + capEditor + blockEditor + guide + '</div></details>';
    setMain(topbar('Calendrier intelligent', '', 'Tes tâches réparties automatiquement sur la semaine') + '<div class="wrap" style="max-width:1440px">' + nudges + cal + overflowHtml + settings + '</div>');
  }
  function planStep(n, title, desc) {
    return '<div style="flex:1;min-width:180px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="width:22px;height:22px;border-radius:50%;background:var(--terre);color:var(--paille);display:flex;align-items:center;justify-content:center;font-family:var(--font-micro);font-size:11px;font-weight:700;flex-shrink:0">' + n + '</span><span style="font-weight:600;color:var(--terre);font-size:13.5px">' + esc(title) + '</span></div>' +
      '<div class="micro" style="color:var(--muted);line-height:1.5">' + esc(desc) + '</div></div>';
  }
  function renderPlanning() {
    setMain(topbar('Calendrier intelligent') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    Promise.all([api('/api/admin/planning').then(function (r) { return r.json(); }), api('/api/admin/tasks').then(function (r) { return r.json(); })]).then(function (res) {
      PLAN_CAP = (res[0] && res[0].days) || {}; PLAN_START = (res[0] && res[0].startHour) || 9.5; PLAN_END = (res[0] && res[0].endHour) || 18; PLAN_LUNCH_START = (res[0] && res[0].lunchStart != null) ? res[0].lunchStart : 13; PLAN_LUNCH_END = (res[0] && res[0].lunchEnd != null) ? res[0].lunchEnd : 14; PLAN_BLOCKS = (res[0] && res[0].blocks) || []; PLAN_TASKS = (res[1] && res[1].tasks) || [];
      renderPlanningView();
    }).catch(showError);
  }
  function savePlanning() { jpost('/api/admin/planning', { days: PLAN_CAP, startHour: PLAN_START, endHour: PLAN_END, lunchStart: PLAN_LUNCH_START, lunchEnd: PLAN_LUNCH_END, blocks: PLAN_BLOCKS }, 'PATCH').catch(function () {}); }
  function planLunch(which, val) { var v = Math.min(23, Math.max(0, parseFloat(val) || 0)); if (which === 'start') { PLAN_LUNCH_START = v; if (PLAN_LUNCH_END < v) PLAN_LUNCH_END = v; } else { PLAN_LUNCH_END = Math.max(PLAN_LUNCH_START, v); } renderPlanningView(); savePlanning(); }
  function planCap(dow, hours) { PLAN_CAP[dow] = Math.max(0, Math.round((parseFloat(hours) || 0) * 60)); renderPlanningView(); savePlanning(); }
  function planStart(h) { PLAN_START = Math.min(20, Math.max(5, parseFloat(h) || 9.5)); if (PLAN_END <= PLAN_START) PLAN_END = PLAN_START + 1; renderPlanningView(); savePlanning(); }
  function planEnd(h) { PLAN_END = Math.min(23, Math.max(PLAN_START + 1, parseFloat(h) || 18)); renderPlanningView(); savePlanning(); }
  function planGroups() { var seen = {}, out = []; PLAN_BLOCKS.forEach(function (b) { var g = b.groupId || b.id; if (!seen[g]) { seen[g] = { groupId: g, label: b.label, color: b.color, count: 0 }; out.push(seen[g]); } seen[g].count++; }); return out; }
  function planTypeChange() { var isNew = el('blk-type').value === '__new__'; var lw = el('blk-label-wrap'), cw = el('blk-color-wrap'); if (lw) lw.style.display = isNew ? '' : 'none'; if (cw) cw.style.display = isNew ? '' : 'none'; }
  function planBlockAdd() {
    var type = el('blk-type').value, dow = parseInt(el('blk-day').value, 10) || 0, time = el('blk-time').value || '09:00', dur = parseInt(el('blk-dur').value, 10) || 60, link = (el('blk-link').value || '').trim();
    if (!dow) { toast('Choisis un jour'); return; }
    var p = time.split(':'); var start = (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0);
    var groupId, label, color;
    if (type && type !== '__new__') { var g = planGroups().filter(function (x) { return x.groupId === type; })[0]; if (!g) { toast('Modèle introuvable'); return; } groupId = g.groupId; label = g.label; color = g.color; }
    else { label = (el('blk-label').value || '').trim(); color = el('blk-color').value || '#8B6F52'; groupId = 'g' + Date.now().toString(36) + (PLAN_SEQ++); }
    PLAN_BLOCKS.push({ id: 'b' + Date.now().toString(36) + (PLAN_SEQ++), groupId: groupId, dow: dow, start: start, duration: Math.min(720, Math.max(5, dur)), label: label, color: color, link: link });
    savePlanning(); renderPlanningView(); toast(link ? 'Rendez-vous visio ajouté' : 'Bloc ajouté');
  }
  function planGroupColor(groupId, color) { PLAN_BLOCKS.forEach(function (b) { if ((b.groupId || b.id) === groupId) b.color = color; }); savePlanning(); renderPlanningView(); }
  function planGroupDel(groupId) { PLAN_BLOCKS = PLAN_BLOCKS.filter(function (b) { return (b.groupId || b.id) !== groupId; }); savePlanning(); renderPlanningView(); toast('Modèle retiré'); }
  function planBlockDel(id) { PLAN_BLOCKS = PLAN_BLOCKS.filter(function (b) { return b.id !== id; }); savePlanning(); renderPlanningView(); toast('Bloc retiré'); }
  function planTaskForm(prefill) {
    var f = el('cta-form'); if (!f) return;
    if (prefill) { f.style.display = ''; var d = el('cta-due'); if (d) d.value = prefill; }
    else { f.style.display = f.style.display === 'none' ? '' : 'none'; }
    if (f.style.display !== 'none') { var ti = el('cta-title'); if (ti) ti.focus(); }
  }
  function planTaskAdd() {
    var title = (el('cta-title').value || '').trim(); if (!title) { toast('Titre requis'); return; }
    jpost('/api/admin/tasks', { title: title, priority: el('cta-prio').value, estMinutes: el('cta-est').value, dueDate: el('cta-due').value || null }).then(function (r) { if (r.ok) { toast('Tâche ajoutée'); renderPlanning(); } else toast('Erreur'); });
  }
  function planDone(id) { jpost('/api/admin/tasks/' + id, { status: 'done' }, 'PATCH').then(function (r) { if (r.ok) { var t = PLAN_TASKS.find(function (x) { return x.id === id; }); if (t) t.status = 'done'; renderPlanningView(); toast('Marqué fait ✓'); } else toast('Erreur'); }); }

  /* ── KPI partenaire créative ── */
  function barsHtml(items, color, fmtVal) {
    if (!items.length) return '<div class="empty">Pas encore de données.</div>';
    var max = Math.max.apply(null, items.map(function (x) { return x.value; })) || 1;
    return '<div style="display:flex;align-items:flex-end;gap:10px;height:170px;padding-top:8px">' + items.map(function (x) {
      var h = Math.round((x.value / max) * 132);
      return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;min-width:0">' +
        '<div style="font-family:var(--font-micro);font-size:10px;font-weight:600;color:var(--terre)">' + (x.value ? (fmtVal ? fmtVal(x.value) : x.value) : '') + '</div>' +
        '<div style="width:100%;max-width:48px;height:' + Math.max(2, h) + 'px;background:' + color + ';border-radius:6px 6px 0 0"></div>' +
        '<div style="font-family:var(--font-micro);font-size:9px;color:var(--muted);white-space:nowrap;letter-spacing:0.03em">' + esc(x.label) + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }
  function monthLbl(k) { var p = k.split('-'); var dd = new Date(p[0], p[1] - 1, 1); return dd.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') + ' ' + String(p[0]).slice(2); }
  var KPI_TAB = 'evol';
  function kpiSetTab(v) { KPI_TAB = v; if (KPI_D) renderKpiBody(KPI_D); }
  function kpiExport() {
    var byClient = (KPI_D && KPI_D.byClient) || [];
    if (!byClient.length) { toast('Rien à exporter'); return; }
    var rows = [['Client', 'Tâches réalisées', 'Temps (h)', 'Tâches en cours']];
    byClient.forEach(function (c) { rows.push([c.client || '', c.tasksDone || 0, (c.minutes / 60).toFixed(2), c.openTasks || 0]); });
    csvDownload('seedtobloom-kpi-clients.csv', rows);
    toast('Export CSV téléchargé');
  }
  var KPI_D = null;
  var KPI_DASH = {}, KPI_VIS = {}, KPI_AVIS = {};
  function renderKpi() {
    setMain(topbar('Tableau de bord') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    Promise.all([
      api('/api/kpi').then(function (r) { return r.json(); }).catch(function () { return {}; }),
      api('/api/dashboard').then(function (r) { return r.json(); }).catch(function () { return {}; }),
      api('/api/visios').then(function (r) { return r.json(); }).catch(function () { return {}; }),
      api('/api/avis').then(function (r) { return r.json(); }).catch(function () { return {}; })
    ]).then(function (res) { KPI_D = res[0] || {}; KPI_DASH = res[1] || {}; KPI_VIS = res[2] || {}; KPI_AVIS = res[3] || {}; renderKpiBody(KPI_D); }).catch(showError);
  }
  // KPIs plaisir : le bilan valorisant depuis le 1er janvier.
  function kpiPlaisirHtml() {
    var d = KPI_D || {};
    var year = String(new Date().getFullYear());
    var doneYear = 0, minYear = 0;
    Object.keys(d.tasksByMonth || {}).forEach(function (k) { if (k.slice(0, 4) === year) doneYear += d.tasksByMonth[k]; });
    Object.keys(d.minutesByMonth || {}).forEach(function (k) { if (k.slice(0, 4) === year) minYear += d.minutesByMonth[k]; });
    var bilans = (KPI_AVIS && KPI_AVIS.bilans) || [];
    var testimonials = bilans.filter(function (b) { return (b.testimonial || '').trim() && b.allowTestimonial; }).length;
    var rated = bilans.filter(function (b) { return b.rating > 0; });
    var satis = rated.length ? (rated.reduce(function (s, b) { return s + b.rating; }, 0) / rated.length) : 0;
    var deliv = (d.totals && d.totals.deliverablesSent) || 0;
    var hoursY = Math.round(minYear / 60);
    var tiles = [];
    tiles.push(['done', doneYear, 'tâches terminées']);
    if (deliv) tiles.push(['visios', deliv, 'créations livrées']);
    tiles.push(['planning', hoursY + ' h', 'de travail']);
    if (testimonials) tiles.push(['avis', testimonials, 'témoignage' + (testimonials > 1 ? 's' : '')]);
    if (satis) tiles.push(['avis', (Math.round(satis * 10) / 10) + '/5', 'satisfaction']);
    var body = tiles.map(function (t) {
      return '<div style="min-width:130px;padding:6px 20px 6px 0">' +
        '<div style="display:flex;align-items:center;gap:7px;font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--glycine-900,#5e3fa0);margin-bottom:5px"><span style="display:inline-flex;color:var(--glycine-900,#5e3fa0)">' + admIcon(t[0]) + '</span>' + esc(t[2]) + '</div>' +
        '<div style="font-family:var(--font-display);font-style:italic;font-size:30px;color:var(--terre);line-height:1">' + t[1] + '</div>' +
      '</div>';
    }).join('');
    return '<div class="card" style="background:var(--card);border:1px solid var(--bone-d);padding:18px 20px;margin-bottom:18px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span style="width:7px;height:7px;border-radius:50%;background:var(--glycine-900,#5e3fa0)"></span><span style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted)">Depuis le 1er janvier ' + year + '</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px 0">' + body + '</div>' +
    '</div>';
  }
  // Santé des collaborations : qui attend quoi, réactivité.
  function kpiCollabHtml() {
    var dash = KPI_DASH || {};
    var dls = dash.deadlines || [];
    var waitYou = {}, waitThem = {};
    dls.forEach(function (x) {
      if (x.status === 'waiting_client') waitThem[x.key] = 1;
      else if (x.status !== 'done' && x.status !== 'review') waitYou[x.key] = 1;
    });
    (dash.pendingValidation || []).forEach(function (l) { waitThem[l.key] = 1; });
    (dash.inbox || []).forEach(function (x) { waitYou[x.key] = 1; });
    var nYou = Object.keys(waitYou).length, nThem = Object.keys(waitThem).length;
    var col = (KPI_D && KPI_D.collaboration) || {};
    var valDays = col.avgValidationDays || 0;
    var inactive = col.inactiveCount || 0;
    function tile(icon, big, label, danger) {
      return '<div style="min-width:150px;padding:6px 20px 6px 0">' +
        '<div style="display:flex;align-items:center;gap:7px;font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);margin-bottom:5px"><span style="display:inline-flex;color:var(--terre-400,#8a7d6b)">' + admIcon(icon) + '</span>' + esc(label) + '</div>' +
        '<div style="font-family:var(--font-display);font-style:italic;font-size:28px;color:' + (danger ? 'var(--red)' : 'var(--terre)') + ';line-height:1">' + big + '</div>' +
      '</div>';
    }
    return '<div class="card" style="background:var(--card);border:1px solid var(--bone-d);padding:18px 20px;margin-bottom:18px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span style="width:7px;height:7px;border-radius:50%;background:var(--terre)"></span><span style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted)">Santé des collaborations</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px 0">' +
        tile('mytasks', nYou, 'en attente de toi', false) +
        tile('clients', nThem, 'en attente d\'elles', false) +
        tile('done', (valDays ? valDays + ' j' : '—'), 'avant validation (moy.)', false) +
        tile('avis', inactive, 'inactives 7 j+', inactive > 0) +
      '</div>' +
    '</div>';
  }
  function kpiTimeByTypeHtml() {
    var list = (KPI_D && KPI_D.timeByType) || [];
    if (!list.length) return '<div class="card infocard" style="background:var(--card)"><h3>Temps par type de tâche</h3><div class="empty">Aucun temps enregistré pour l\'instant. Le temps que tu passes sur tes tâches et tes tickets apparaîtra ici, réparti par type — pour voir où tu passes le plus de temps.</div></div>';
    function hh(m) { m = Math.round(m || 0); var h = Math.floor(m / 60), r = m % 60; return h ? h + 'h' + (r ? ('' + (r < 10 ? '0' : '') + r) : '') : m + ' min'; }
    var total = list.reduce(function (s, x) { return s + (x.minutes || 0); }, 0);
    var maxM = list[0].minutes || 1;
    var rows = list.map(function (x, i) {
      var pct = Math.round((x.minutes / maxM) * 100);
      var share = total ? Math.round((x.minutes / total) * 100) : 0;
      var col = i === 0 ? 'var(--terre)' : 'var(--glycine-700)';
      return '<div style="margin-bottom:14px"><div class="between" style="margin-bottom:5px"><strong style="font-size:14px;color:var(--terre)">' + esc(x.type) + '</strong><span class="micro" style="color:var(--terre);font-weight:700">' + hh(x.minutes) + ' · ' + share + '%</span></div>' +
        '<div style="height:10px;background:var(--surface-2);border-radius:999px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + col + ';border-radius:999px"></div></div></div>';
    }).join('');
    return '<div class="card infocard" style="background:var(--card)"><h3>Temps par type de tâche</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Où passe ton temps : ' + hh(total) + ' au total sur les tâches terminées et les tickets, réparti par type (pôle). Le plus chronophage en premier.</div>' +
      rows + '</div>';
  }
  function kpiRentabiliteHtml() {
    var pr = (KPI_D && KPI_D.profitability) || {};
    var estH = Math.round((pr.estMin || 0) / 60 * 10) / 10, realH = Math.round((pr.realMin || 0) / 60 * 10) / 10;
    var ratio = pr.estMin > 0 ? Math.round(pr.realMin / pr.estMin * 100) : 0;
    if (!pr.estCount) return '<div class="card infocard" style="background:var(--card)"><h3>Rentabilité · estimé vs réel</h3><div class="empty">Renseigne un « temps estimé » sur tes tâches (dans le détail d\'une tâche) pour comparer avec le temps réellement passé. Après quelques projets, tu sauras combien te prend vraiment chaque type de travail.</div></div>';
    function hh(m) { m = Math.round(m); var h = Math.floor(m / 60), r = m % 60; return h + 'h' + (r ? ('' + (r < 10 ? '0' : '') + r) : ''); }
    var poleRows = (pr.poles || []).map(function (p) {
      var r = p.est > 0 ? Math.round(p.real / p.est * 100) : 0;
      var over = r > 110, under = r < 90;
      var col = over ? 'var(--red)' : (under ? '#3a6b4a' : 'var(--terre)');
      return '<div class="prow" style="display:block;padding:10px 4px"><div class="between"><strong style="font-size:14px">' + esc(p.pole) + '</strong>' +
        '<span class="micro" style="color:' + col + ';font-weight:700">réel ' + r + '% de l\'estimé</span></div>' +
        '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:3px">prévu ' + hh(p.est) + ' · réel ' + hh(p.real) + ' · ' + p.count + ' tâche' + (p.count > 1 ? 's' : '') + '</div></div>';
    }).join('');
    return '<div class="card infocard" style="background:var(--card)"><h3>Rentabilité · estimé vs réel</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Sur les ' + pr.estCount + ' tâche' + (pr.estCount > 1 ? 's' : '') + ' terminée' + (pr.estCount > 1 ? 's' : '') + ' avec une estimation.</div>' +
      '<div class="row" style="gap:22px;flex-wrap:wrap;margin-bottom:14px">' +
        '<div><div class="micro">Prévu</div><div style="font-family:var(--font-display);font-style:italic;font-size:28px;color:var(--terre)">' + estH + ' h</div></div>' +
        '<div><div class="micro">Réel</div><div style="font-family:var(--font-display);font-style:italic;font-size:28px;color:' + (ratio > 110 ? 'var(--red)' : 'var(--terre)') + '">' + realH + ' h</div></div>' +
        '<div><div class="micro">Écart</div><div style="font-family:var(--font-display);font-style:italic;font-size:28px;color:' + (ratio > 110 ? 'var(--red)' : (ratio < 90 ? '#3a6b4a' : 'var(--terre)')) + '">' + ratio + '%</div></div>' +
      '</div>' +
      '<h4 style="margin:6px 0 8px;font-size:14px">Par pôle</h4>' + (poleRows || '<div class="empty">—</div>') + '</div>';
  }
  // Accueil KPI : les 6 cartes essentielles + le score « Santé du studio ».
  function kpiSummaryHtml() {
    var dash = KPI_DASH || {};
    var today = new Date(); today.setHours(0, 0, 0, 0);
    function dd(s) { var t = new Date(s); t.setHours(0, 0, 0, 0); return Math.round((t - today) / 86400000); }
    function iso(dt) { return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); }
    function hL(m) { m = Math.round(m || 0); if (!m) return '0'; if (m < 60) return m + ' min'; var h = Math.floor(m / 60), r = m % 60; return h + 'h' + (r ? ('' + (r < 10 ? '0' : '') + r) : ''); }
    var dls = dash.deadlines || [];
    var mine = dls.filter(function (x) { return x.status !== 'waiting_client' && x.status !== 'review'; });
    var overdue = mine.filter(function (x) { return x.dueDate && dd(x.dueDate) < 0 && x.status !== 'done'; }).length;
    var inboxN = (dash.inbox || []).length;
    // Charge de la semaine : temps estimé des tâches dues sur 5 jours ouvrés.
    var weekMin = 0; var cur = new Date(today); var seen = 0;
    while (seen < 5) { var dow = cur.getDay(); if (dow !== 0 && dow !== 6) { var di = iso(cur); mine.forEach(function (x) { if ((x.dueDate || '').slice(0, 10) === di && x.status !== 'done') weekMin += (x.estMinutes > 0 ? x.estMinutes : 45); }); seen++; } cur.setDate(cur.getDate() + 1); }
    var weekCapH = dash.weeklyCapacity || 0;
    var forfSurv = (dash.forfaits || []).filter(function (f) { return f.configured && f.remaining <= f.base * 0.2; }).length;
    var visN = ((KPI_VIS && KPI_VIS.cards) || []).filter(function (c) { return (c.date || '').slice(0, 10) === iso(today) && !c.done; }).length;
    var chronoWeek = dash.weekTimeMinutes || 0;
    var waitClient = (dash.pendingValidation || []).length + dls.filter(function (x) { return x.status === 'waiting_client'; }).length;
    // Score Santé du studio /100
    var score = 100;
    score -= Math.min(overdue * 6, 30);
    if (weekCapH && weekMin > weekCapH * 60) score -= 15;
    score -= Math.min(forfSurv * 8, 24);
    score -= Math.min(Math.max(inboxN - 3, 0) * 3, 15);
    score -= Math.min(Math.max(waitClient - 3, 0) * 2, 12);
    score = Math.max(0, Math.min(100, Math.round(score)));
    var scoreCol = score >= 80 ? '#3a6b4a' : (score >= 55 ? '#b8871f' : '#a23c28');
    var scoreLbl = score >= 80 ? 'Tout est sous contrôle' : (score >= 55 ? 'Quelques points à surveiller' : 'À réorganiser cette semaine');
    var chargeOver = weekCapH && weekMin > weekCapH * 60;
    function card(icon, big, label, sub, onclick) {
      return '<button onclick="' + onclick + '" style="text-align:left;background:var(--card);border:1px solid var(--bone-d);border-radius:14px;padding:15px 16px;cursor:pointer;display:flex;flex-direction:column;gap:4px;transition:box-shadow .14s" onmouseenter="this.style.boxShadow=\'0 3px 14px rgba(28,18,5,0.08)\'" onmouseleave="this.style.boxShadow=\'\'">' +
        '<span style="display:flex;align-items:center;gap:8px;font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted)"><span style="color:var(--terre-400,#8a7d6b);display:inline-flex">' + admIcon(icon) + '</span>' + esc(label) + '</span>' +
        '<span style="font-family:var(--font-display);font-style:italic;font-size:26px;color:var(--terre);line-height:1.05">' + big + '</span>' +
        (sub ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">' + sub + '</span>' : '') +
      '</button>';
    }
    var cards =
      card('planning', hL(weekMin) + (weekCapH ? ' <span style="font-size:14px;color:var(--muted)">/ ' + weekCapH + 'h</span>' : ''), 'Charge de la semaine', chargeOver ? 'au-delà de ta capacité' : '', "ADM.nav('priorities');setTimeout(function(){ADM.prioSetTab('load')},60)") +
      card('inbox', inboxN, 'Demandes à analyser', inboxN ? 'à trier dans l\'Inbox' : 'rien en attente', "ADM.nav('inbox')") +
      card('priorities', overdue, 'Tâches en retard', '', "ADM.nav('priorities');setTimeout(function(){ADM.prioSetTab('risks')},60)") +
      card('kpi', forfSurv + ' cliente' + (forfSurv > 1 ? 's' : ''), 'Forfaits à surveiller', '', "ADM.nav('priorities');setTimeout(function(){ADM.prioSetTab('load')},60)") +
      card('visios', visN, 'Visios aujourd\'hui', '', "ADM.nav('visios')") +
      card('done', hL(chronoWeek), 'Temps chronométré (semaine)', '', "ADM.nav('mytasks')");
    return '<div class="card" style="background:linear-gradient(135deg,' + hexA(scoreCol, 0.10) + ',var(--card));border-color:' + hexA(scoreCol, 0.3) + ';display:flex;align-items:center;gap:22px;flex-wrap:wrap;margin-bottom:16px">' +
        '<div style="width:96px;height:96px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:conic-gradient(' + scoreCol + ' ' + (score * 3.6) + 'deg, var(--bone-d) 0deg)">' +
          '<div style="width:76px;height:76px;border-radius:50%;background:var(--card);display:grid;place-items:center"><div style="font-family:var(--font-display);font-style:italic;font-size:28px;color:' + scoreCol + ';line-height:1">' + score + '</div></div>' +
        '</div>' +
        '<div style="min-width:0"><div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted)">Santé du studio</div>' +
          '<div style="font-family:var(--font-display);font-style:italic;font-size:26px;color:var(--terre)">' + score + ' / 100</div>' +
          '<div style="font-size:14px;color:' + scoreCol + ';font-weight:600;margin-top:2px">' + esc(scoreLbl) + '</div></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:22px">' + cards + '</div>';
  }
  function hexA(hex, a) { var h = String(hex || '').replace('#', ''); if (h.length !== 6) return 'rgba(94,63,160,' + a + ')'; return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')'; }
  function renderKpiBody(d) {
    var t = d.totals || {};
    function kc(n, l) { return '<div class="kpi"><div class="kpi__n">' + n + '</div><div class="kpi__l">' + l + '</div></div>'; }
    var kpis = '<div class="kpis">' + kc(t.done || 0, 'Tâches réalisées') + kc(((t.minutes || 0) / 60).toFixed(0) + ' h', 'Temps passé') + kc(t.open || 0, 'Tâches en cours') + kc(t.clients || 0, 'Clients actifs') + '</div>';
    var keys = Object.keys(d.tasksByMonth || {}).sort().slice(-8);
    var tItems = keys.map(function (k) { return { label: monthLbl(k), value: d.tasksByMonth[k] || 0 }; });
    var mItems = keys.map(function (k) { return { label: monthLbl(k), value: Math.round((d.minutesByMonth[k] || 0) / 60 * 10) / 10 }; });
    var clientRows = (d.byClient || []).map(function (c) {
      return '<tr><td><a href="javascript:ADM.openClient(\'' + c.key + '\')">' + esc(c.client) + '</a></td>' +
        '<td>' + c.tasksDone + '</td><td>' + (c.minutes / 60).toFixed(1).replace('.0', '') + ' h</td><td>' + c.openTasks + '</td></tr>';
    }).join('') || '<tr><td colspan="4" class="empty">Aucun client partenaire.</td></tr>';
    var forf = (d.forfaits || []).filter(function (f) { return f.configured; }).map(function (f) {
      var pct = f.base > 0 ? Math.min(100, Math.round(f.used / f.base * 100)) : 0; var over = f.remaining < 0;
      return '<div class="prow" style="display:block;padding:10px 4px"><div class="between"><strong style="font-size:14px">' + esc(f.client) + '</strong><span class="micro" style="color:' + (over ? 'var(--red)' : 'var(--muted)') + '">' + f.used + ' / ' + f.base + ' h</span></div><div class="bar' + (over ? ' over' : '') + '" style="margin-top:6px"><span style="width:' + pct + '%"></span></div></div>';
    }).join('') || '<div class="empty">Aucun forfait configuré.</div>';
    var tabDefs = [['evol', 'Évolution', null], ['temps', 'Temps par type', null], ['rentabilite', 'Rentabilité', null], ['clients', 'Par client', (d.byClient || []).length], ['forfaits', 'Forfaits', (d.forfaits || []).filter(function (f) { return f.configured; }).length]];
    if (!tabDefs.some(function (x) { return x[0] === KPI_TAB; })) KPI_TAB = 'evol';
    var tabBar = '<div class="tabs">' + tabDefs.map(function (x) {
      return '<button class="tab' + (KPI_TAB === x[0] ? ' active' : '') + '" onclick="ADM.kpiSetTab(\'' + x[0] + '\')">' + esc(x[1]) + (x[2] != null ? badge(x[2]) : '') + '</button>';
    }).join('') + '</div>';
    var body;
    if (KPI_TAB === 'clients') {
      body = '<div class="card"><div class="between mb"><h3 style="margin:0">Par client</h3><button class="btn btn--outline btn--sm" onclick="ADM.kpiExport()">Exporter en CSV</button></div><table><thead><tr><th>Client</th><th>Réalisées</th><th>Temps</th><th>En cours</th></tr></thead><tbody>' + clientRows + '</tbody></table></div>';
    } else if (KPI_TAB === 'forfaits') {
      body = '<div class="card"><h3>Forfaits du mois</h3>' + forf + '</div>';
    } else if (KPI_TAB === 'temps') {
      body = kpiTimeByTypeHtml();
    } else if (KPI_TAB === 'rentabilite') {
      body = kpiRentabiliteHtml();
    } else {
      body = '<div class="pcols">' +
        '<div class="card"><h3>Tâches réalisées par mois</h3>' + barsHtml(tItems, 'var(--glycine-900)') + '</div>' +
        '<div class="card"><h3>Temps passé par mois</h3>' + barsHtml(mItems, '#c9952f', function (v) { return v + ' h'; }) + '</div></div>';
    }
    setMain(topbar('Tableau de bord', '', 'D\'un coup d\'œil : ta semaine, puis le détail') + '<div class="wrap">' + kpiSummaryHtml() + kpiCollabHtml() + kpiPlaisirHtml() +
      '<h3 style="margin:8px 0 12px;font-size:16px">Détail · partenaire créative</h3>' + kpis + tabBar + '<div id="kpibody">' + body + '</div></div>');
  }

  /* ── Réalisé (historique daté) ── */
  var DONE_LIST = [];
  function csvCell(v) { v = String(v == null ? '' : v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function csvDownload(name, rows) {
    var csv = '﻿' + rows.map(function (r) { return r.map(csvCell).join(';'); }).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }
  function doneExport() {
    if (!DONE_LIST.length) { toast('Rien à exporter'); return; }
    var rows = [['Date', 'Client', 'Projet', 'Type', 'Titre', 'Temps (h)']];
    DONE_LIST.forEach(function (x) {
      rows.push([(x.completedAt || '').slice(0, 10), x.client || '', x.projectLabel || '', x.kind || '', x.title || '', x.timeSpentMinutes ? (x.timeSpentMinutes / 60).toFixed(2) : '']);
    });
    csvDownload('seedtobloom-realise.csv', rows);
    toast('Export CSV téléchargé');
  }
  function renderDone() {
    setMain(topbar('Réalisé') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/done').then(function (r) { return r.json(); }).then(function (d) {
      var list = d.completed || [];
      DONE_LIST = list;
      var groups = {}, order = [];
      list.forEach(function (x) {
        var dt = new Date(x.completedAt);
        var k = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
        if (!groups[k]) { groups[k] = []; order.push(k); }
        groups[k].push(x);
      });
      function monthLabel(k) { var p = k.split('-'); var d = new Date(p[0], p[1] - 1, 1); var s = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1); }
      function fmtDT(iso) { var d = new Date(iso); if (isNaN(d)) return esc(iso); var dd = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); var hh = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); return dd + ' à ' + hh; }
      var nowD = new Date(); var curKey = nowD.getFullYear() + '-' + String(nowD.getMonth() + 1).padStart(2, '0');
      var totalMinAll = list.reduce(function (s, x) { return s + (x.timeSpentMinutes || 0); }, 0);
      var monthCount = (groups[curKey] || []).length;
      function kc(n, l) { return '<div class="kpi"><div class="kpi__n">' + n + '</div><div class="kpi__l">' + l + '</div></div>'; }
      var hero = list.length ? '<div class="kpis">' + kc(list.length, 'Réalisés en tout') + kc(monthCount, 'Ce mois-ci') + kc((totalMinAll / 60).toFixed(0) + ' h', 'Temps cumulé') + '</div>' : '';
      var html = order.map(function (k) {
        var items = groups[k];
        var totalMin = items.reduce(function (s, x) { return s + (x.timeSpentMinutes || 0); }, 0);
        var rows = items.map(function (x) {
          var tm = x.timeSpentMinutes ? (' · ' + (x.timeSpentMinutes / 60).toFixed(1).replace('.0', '') + ' h') : '';
          return '<div class="prow"><div class="prow__date"><strong>' + fmtDT(x.completedAt) + '</strong></div>' +
            '<div class="prow__main"><div class="prow__el">' + esc(x.title) + '</div>' +
              '<div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + ' · ' + esc(x.kind) + tm + '</div></div>' +
            '<div>' + pill('done', 'Terminé') + '</div></div>';
        }).join('');
        return '<div class="card"><h3>' + monthLabel(k) + ' <span class="micro" style="color:var(--muted)">· ' + items.length + ' réalisé' + (items.length > 1 ? 's' : '') + (totalMin ? ' · ' + (totalMin / 60).toFixed(1).replace('.0', '') + ' h' : '') + '</span></h3>' + rows + '</div>';
      }).join('');
      var exportBtn = list.length ? '<button class="btn btn--outline btn--sm" onclick="ADM.doneExport()">Exporter en CSV</button>' : '';
      setMain(topbar('Réalisé', exportBtn, 'L\'historique daté de tout ce qui a été terminé') + '<div class="wrap">' + hero + (html || '<div class="empty">Rien de terminé pour le moment. Marque des tâches « Fait » depuis Priorités ou les espaces clients.</div>') + '</div>');
    }).catch(showError);
  }

  function prioUrl(key, kind, id) { return '/api/clients/' + key + (kind === 'tâche' ? '/tasks/' : kind === 'ticket' ? '/tickets/' : '/steps/') + id; }
  function prioTicketStart(key, id) {
    notifyConfirm('Prévenir la cliente par e-mail que tu commences à travailler sur sa demande ?', function (notify) {
      jpost('/api/clients/' + key + '/tickets/' + id, { projectId: 'maintenance', status: 'in_progress', notify: notify }, 'PATCH').then(function (r) {
        if (!r.ok) { toast('Erreur'); return; }
        toast('Ticket en cours' + (notify ? ' · cliente prévenue ✓' : ''));
        if (PRIO_D && Array.isArray(PRIO_D.deadlines)) { var it = PRIO_D.deadlines.filter(function (x) { return x.id === id && x.key === key; })[0]; if (it) it.status = 'in_progress'; renderPrioBody(PRIO_D); } else renderPriorities();
      });
    });
  }
  function prioDone(key, project, kind, id) {
    var send = function (extra) {
      jpost(prioUrl(key, kind, id), Object.assign({ projectId: project, status: 'done' }, extra || {}), 'PATCH').then(function (r) {
        if (!r.ok) { toast('Erreur'); return; }
        toast('Marqué fait ✓');
        // MAJ optimiste : une tâche terminée quitte les listes (KV peut être en retard).
        if (PRIO_D && Array.isArray(PRIO_D.deadlines)) { PRIO_D.deadlines = PRIO_D.deadlines.filter(function (x) { return !(x.id === id && x.key === key); }); renderPrioBody(PRIO_D); }
        else renderPriorities();
      });
    };
    if (kind === 'ticket') { notifyConfirm('Prévenir la cliente par e-mail que sa demande est résolue ?', function (notify) { send({ notify: notify }); }); return; }
    send({});
  }
  function prioAddDlv(key, id) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(inp);
    var cleanup = function () { if (inp.parentNode) inp.parentNode.removeChild(inp); };
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; if (!f) { cleanup(); return; }
      if (admTooBig(f)) { cleanup(); toast(admBigMsg(f)); return; }
      var cd = (PRIO_D && Array.isArray(PRIO_D.deadlines)) ? PRIO_D.deadlines.filter(function (x) { return x.id === id; })[0] : null;
      var cname = cd ? cd.client : 'le client';
      notifyConfirm('Envoyer ce livrable à la cliente et la prévenir par e-mail ?', function (notify) {
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', 'partner'); fd.append('deliverable', '1'); fd.append('taskId', id); fd.append('notify', notify ? 'true' : 'false');
      toast('Envoi du livrable…');
      api('/api/clients/' + key + '/files', { method: 'POST', body: fd }).then(admUploadResult)
        .then(function (res) { cleanup(); if (res.ok) { toast('Livrable envoyé à ' + cname + (notify ? ' · prévenu·e par e-mail' : ' (sans e-mail)')); PRIO_TAB = 'waiting'; refreshPriorities(); } else toast(admUploadErrMsg(res.status, res.d && res.d.error)); })
        .catch(function () { cleanup(); toast('Erreur — livrable non envoyé (fichier volumineux ? envoie-le en lien). Réessaie.'); });
      });
    };
    inp.click();
  }
  // Déposer un livrable sous forme de LIEN depuis Priorités.
  function prioAddDlvLink(key, id) {
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box">' +
      '<div class="admconfirm__title">Livrable sous forme de lien</div>' +
      '<div class="admconfirm__msg">Colle le lien du livrable (Figma, Drive, proofing…). Le client pourra le voir puis le valider ou demander une révision.</div>' +
      '<input id="prio-dl-name" class="inp" style="width:100%;margin:6px 0" placeholder="Nom (optionnel)">' +
      '<input id="prio-dl-url" class="inp" style="width:100%;margin:0 0 6px" placeholder="https://…">' +
      '<label class="micro" style="display:flex;align-items:center;gap:8px;text-transform:none;letter-spacing:0;margin:0 0 4px">Temps passé <input id="prio-dl-mins" class="inp" type="number" min="0" step="15" style="width:90px" placeholder="min"> min (ajouté à la tâche)</label>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Envoyer au client</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    var send = function () {
      var url = (el('prio-dl-url').value || '').trim();
      if (!url) { toast('Colle un lien'); return; }
      var name = (el('prio-dl-name').value || '').trim();
      var mins = Math.max(0, parseInt((el('prio-dl-mins') || {}).value, 10) || 0);
      close();
      notifyConfirm('Envoyer ce livrable (lien) à la cliente et la prévenir par e-mail ?', function (notify) {
      jpost('/api/clients/' + key + '/deliverables', { projectId: 'partner', taskId: id, link: url, name: name, notify: notify }).then(admUploadResult)
        .then(function (res) {
          if (res.ok) {
            if (mins) { var cd = (PRIO_D && Array.isArray(PRIO_D.deadlines)) ? PRIO_D.deadlines.filter(function (x) { return x.id === id && x.key === key; })[0] : null; var total = Math.round(((cd && cd.timeSpentSeconds) || 0) / 60) + mins; jpost('/api/clients/' + key + '/tasks/' + id, { projectId: 'partner', timeSpentMinutes: total, timeSpentSeconds: total * 60, forceTime: true }, 'PATCH'); }
            toast((mins ? 'Livrable envoyé · ' + mins + ' min' : 'Livrable envoyé') + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')); PRIO_TAB = 'waiting'; refreshPriorities();
          } else toast(admUploadErrMsg(res.status, res.d && res.d.error));
        })
        .catch(function () { toast('Erreur — livrable non envoyé, réessaie'); });
      });
    };
    ov.querySelector('[data-yes]').onclick = send;
    document.body.appendChild(ov);
    var i = el('prio-dl-url'); if (i) i.focus();
  }
  // Envoyer un lien de révision au client directement depuis Priorités :
  // petit prompt, puis PATCH (reviewLink + passage en « à valider » + journal).
  function prioSendReview(key, id, cur) {
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box">' +
      '<div class="admconfirm__title">Lien de révision</div>' +
      '<div class="admconfirm__msg">Colle le lien (Figma, proofing, Drive…). La tâche passera en « À valider ». Tu choisiras ensuite de prévenir la cliente ou non.</div>' +
      '<input id="prio-rl" class="inp" style="width:100%;margin:6px 0 4px" placeholder="https://…" value="' + esc(cur || '') + '">' +
      '<div class="admconfirm__row">' +
        '<button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Envoyer au client</button>' +
      '</div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    var send = function () {
      var link = (el('prio-rl').value || '').trim();
      if (!link) { toast('Ajoute un lien'); return; }
      close();
      notifyConfirm('Envoyer ce lien de révision à la cliente et la prévenir par e-mail ?', function (notify) {
      jpost('/api/clients/' + key + '/tasks/' + id, { projectId: 'partner', reviewLink: link, status: 'review', logReview: true, notify: notify }, 'PATCH')
        .then(function (r) {
          if (!r.ok) { toast('Erreur'); return; }
          toast('Lien envoyé' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)'));
          // MAJ optimiste locale : KV peut renvoyer l'ancien statut pendant
          // ~1 s, ce qui donnait l'impression que rien ne bougeait. On bascule
          // directement la tâche en « Attente client » sans re-fetch.
          var it = (PRIO_D && Array.isArray(PRIO_D.deadlines)) ? PRIO_D.deadlines.filter(function (x) { return x.id === id && x.project === 'partner'; })[0] : null;
          if (it) { it.status = 'review'; it.reviewLink = link; it.reviewSentAt = new Date().toISOString(); PRIO_TAB = 'waiting'; renderPrioBody(PRIO_D); }
          else { PRIO_TAB = 'waiting'; renderPriorities(); }
        });
      });
    };
    ov.querySelector('[data-yes]').onclick = send;
    document.body.appendChild(ov);
    var i = el('prio-rl'); if (i) { i.focus(); i.onkeydown = function (e) { if (e.key === 'Enter') send(); }; }
  }
  // Saisie manuelle du temps passé (heures + minutes) depuis Priorités.
  function prioSetTime(key, id, curSec, kind, project) {
    kind = kind || 'tâche'; project = project || 'partner';
    curSec = parseInt(curSec, 10) || 0;
    var h0 = Math.floor(curSec / 3600), m0 = Math.round((curSec % 3600) / 60);
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box">' +
      '<div class="admconfirm__title">Temps passé sur ' + (kind === 'ticket' ? 'ce ticket' : 'la tâche') + '</div>' +
      '<div class="admconfirm__msg">Corrige ou saisis le temps à la main. Il remplace la valeur actuelle et reste visible par le client.</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin:8px 0 4px">' +
        '<input id="prio-th" class="inp" type="number" min="0" step="1" value="' + h0 + '" style="width:70px"><span class="micro" style="text-transform:none;letter-spacing:0">h</span>' +
        '<input id="prio-tm" class="inp" type="number" min="0" max="59" step="5" value="' + m0 + '" style="width:70px"><span class="micro" style="text-transform:none;letter-spacing:0">min</span>' +
      '</div>' +
      '<div class="admconfirm__row">' +
        '<button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Enregistrer</button>' +
      '</div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    var save = function () {
      var h = Math.max(0, parseInt(el('prio-th').value, 10) || 0);
      var m = Math.max(0, Math.min(59, parseInt(el('prio-tm').value, 10) || 0));
      var total = h * 3600 + m * 60;
      close();
      var pit = (PRIO_D && Array.isArray(PRIO_D.deadlines)) ? PRIO_D.deadlines.filter(function (x) { return x.id === id; })[0] : null;
      if (pit) { pit.timeSpentSeconds = total; pit.timeSpentMinutes = Math.round(total / 60); }
      if (kind === 'ticket') {
        var dm = findDomain('maintenance');
        if (dm && Array.isArray(dm.content.tickets)) { var di = dm.content.tickets.findIndex(function (t) { return t.id === id; }); if (di !== -1) { dm.content.tickets[di].timeSpentSeconds = total; dm.content.tickets[di].timeSpentMinutes = Math.round(total / 60); } }
        if (PRIO_D) renderPrioBody(PRIO_D);
        jpost('/api/clients/' + key + '/tickets/' + id, { projectId: project, timeSpentSeconds: total, timeSpentMinutes: Math.round(total / 60) }, 'PATCH')
          .then(function (r) { if (r.ok) toast('Temps enregistré ✓'); else toast('Erreur'); });
      } else {
        var local = ptFind(id); if (local) { local.timeSpentSeconds = total; local.timeSpentMinutes = Math.round(total / 60); }
        if (PRIO_D) renderPrioBody(PRIO_D);
        jpost('/api/clients/' + key + '/tasks/' + id, { projectId: 'partner', timeSpentSeconds: total, timeSpentMinutes: Math.round(total / 60), forceTime: true }, 'PATCH')
          .then(function (r) { if (r.ok) toast('Temps enregistré ✓'); else toast('Erreur'); });
      }
    };
    ov.querySelector('[data-yes]').onclick = save;
    document.body.appendChild(ov);
    var i = el('prio-th'); if (i) i.focus();
  }
  // Ajouter du temps sur une tâche déjà en attente/livrée (Priorités) : on ne
  // connaît pas forcément son total ici, donc on envoie un delta (addMinutes).
  function prioAddTaskTime(key, id) {
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box">' +
      '<div class="admconfirm__title">Ajouter du temps passé</div>' +
      '<div class="admconfirm__msg">Temps à ajouter au total de cette tâche (elle est déjà en attente ou livrée).</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin:8px 0 4px">' +
        '<input id="prio-add-h" class="inp" type="number" min="0" step="1" value="0" style="width:70px"><span class="micro" style="text-transform:none;letter-spacing:0">h</span>' +
        '<input id="prio-add-m" class="inp" type="number" min="0" max="59" step="5" value="0" style="width:70px"><span class="micro" style="text-transform:none;letter-spacing:0">min</span>' +
      '</div>' +
      '<div class="admconfirm__row">' +
        '<button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Ajouter</button>' +
      '</div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var h = Math.max(0, parseInt(el('prio-add-h').value, 10) || 0);
      var m = Math.max(0, parseInt(el('prio-add-m').value, 10) || 0);
      var add = h * 60 + m;
      close();
      if (add <= 0) { toast('Indique un temps à ajouter'); return; }
      jpost('/api/clients/' + key + '/tasks/' + id, { projectId: 'partner', addMinutes: add }, 'PATCH')
        .then(function (r) {
          if (r.ok) {
            toast('Temps ajouté ✓ · +' + (h ? h + 'h' : '') + (m ? m + 'min' : ''));
            var sec = (r.d && r.d.timeSpentSeconds) || 0;
            var pit = (PRIO_D && Array.isArray(PRIO_D.deadlines)) ? PRIO_D.deadlines.filter(function (x) { return x.id === id; })[0] : null;
            if (pit && sec) pit.timeSpentSeconds = sec;
            var local = ptFind(id); if (local && sec) { local.timeSpentSeconds = sec; local.timeSpentMinutes = Math.round(sec / 60); }
          } else toast((r.d && r.d.error) || 'Erreur');
        });
    };
    document.body.appendChild(ov);
    var i = el('prio-add-h'); if (i) i.focus();
  }
  function prioProposeDate(key, id, cur, kind) {
    var isTicket = kind === 'ticket';
    var inp = document.createElement('input'); inp.type = 'date'; if (cur) inp.value = cur;
    inp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(inp);
    var cleanup = function () { if (inp.parentNode) inp.parentNode.removeChild(inp); };
    inp.onchange = function () {
      var v = inp.value; cleanup(); if (!v) return;
      notifyConfirm('Proposer cette date à la cliente et la prévenir par e-mail ?', function (notify) {
        var url = isTicket ? '/api/clients/' + key + '/tickets/' + id : '/api/clients/' + key + '/tasks/' + id;
        var body = isTicket ? { projectId: 'maintenance', proposedDueDate: v, notify: notify } : { projectId: 'partner', proposedDueDate: v, notify: notify };
        jpost(url, body, 'PATCH').then(function (r) {
          if (r.ok) { toast('Report proposé' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')); if (PRIO_D && Array.isArray(PRIO_D.deadlines)) { var it = PRIO_D.deadlines.filter(function (x) { return x.id === id && x.key === key; })[0]; if (it) it.proposedDueDate = v; renderPrioBody(PRIO_D); } else renderPriorities(); } else toast('Erreur');
        });
      });
    };
    inp.onblur = function () { setTimeout(cleanup, 200); };
    if (inp.showPicker) { try { inp.showPicker(); return; } catch (e) { } }
    inp.focus(); inp.click();
  }
  function prioPostpone(key, project, kind, id, cur) {
    var inp = document.createElement('input'); inp.type = 'date'; if (cur) inp.value = cur;
    inp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(inp);
    var cleanup = function () { if (inp.parentNode) inp.parentNode.removeChild(inp); };
    inp.onchange = function () {
      var v = inp.value; cleanup(); if (!v) return;
      var body = { projectId: project }; if (kind === 'tâche' || kind === 'ticket') body.dueDate = v; else body.date = v;
      jpost(prioUrl(key, kind, id), body, 'PATCH').then(function (r) { if (r.ok) { toast('Reporté au ' + fmtDate(v)); renderPriorities(); } else toast('Erreur'); });
    };
    inp.onblur = function () { setTimeout(cleanup, 200); };
    if (inp.showPicker) { try { inp.showPicker(); return; } catch (e) { } }
    inp.focus(); inp.click();
  }

  /* ── Clients ── */
  function renderClients() {
    var right = '<button class="btn btn--outline btn--sm" onclick="ADM.scan()">Scanner le KV</button><button class="btn" onclick="ADM.nav(\'newclient\')">+ Nouveau client</button>';
    setMain(topbar('Clients', right) + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/clients').then(function (r) { return r.json(); }).then(function (d) {
      var clients = (d.clients || []).slice().sort(function (a, b) {
        if ((b.unread || 0) !== (a.unread || 0)) return (b.unread || 0) - (a.unread || 0);
        if (!!b.isActive !== !!a.isActive) return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0);
        return clientName(a).localeCompare(clientName(b));
      });
      var actifs = clients.filter(function (c) { return c.isActive; }).length;
      var totalUnread = clients.reduce(function (s, c) { return s + (c.unread || 0); }, 0);
      var head = '<div class="micro" style="margin:-2px 0 16px;color:var(--terre-600)">' + clients.length + ' espace' + (clients.length > 1 ? 's' : '') + ' · ' + actifs + ' actif' + (actifs > 1 ? 's' : '') + (totalUnread ? ' · ' + totalUnread + ' message' + (totalUnread > 1 ? 's' : '') + ' à lire' : '') + '</div>';
      var list = clients.map(clientCard).join('');
      setMain(topbar('Clients', right, 'Tous tes espaces clients en un coup d\'œil') + '<div class="wrap">' + (list ? head + '<div class="grid grid--3">' + list + '</div>' : '<div class="empty">Aucun client. Crée-en un, ou scanne le KV pour récupérer les clés existantes.</div>') + '</div>');
    }).catch(showError);
  }
  // Présence : « En ligne » si activité < 5 min (le poll client entretient
  // l'horodatage), sinon dernière connexion en relatif.
  function presence(lastSeen) {
    if (!lastSeen) return { online: false, label: 'Jamais connecté' };
    var diff = Math.floor(Date.now() / 1000) - lastSeen;
    if (diff < 360) return { online: true, label: 'En ligne' };
    if (diff < 3600) return { online: false, label: 'Vu il y a ' + Math.max(1, Math.round(diff / 60)) + ' min' };
    if (diff < 86400) return { online: false, label: 'Vu il y a ' + Math.round(diff / 3600) + ' h' };
    if (diff < 7 * 86400) return { online: false, label: 'Vu il y a ' + Math.round(diff / 86400) + ' j' };
    return { online: false, label: 'Vu le ' + new Date(lastSeen * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) };
  }
  function clientName(c) { return ((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.entreprise || c.email || c.key; }
  function clientInitials(c) {
    var src = ((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.entreprise || c.email || '?';
    var parts = src.replace(/[^\p{L}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean);
    var ini = parts.length >= 2 ? (parts[0][0] + parts[1][0]) : (parts[0] ? parts[0].slice(0, 2) : '?');
    return ini.toUpperCase();
  }
  function clientCard(c) {
    var nm = clientName(c);
    var co = c.entreprise || '';
    var active = c.isActive;
    var unread = c.unread || 0;
    return '<div class="ctile" tabindex="0" onclick="ADM.openClient(\'' + c.key + '\')" onkeydown="if(event.key===\'Enter\')ADM.openClient(\'' + c.key + '\')">' +
      '<div class="ctile__top">' +
        '<div class="ctile__av">' + esc(clientInitials(c)) + '</div>' +
        '<div class="ctile__id"><div class="ctile__name">' + esc(nm) + '</div>' + (co ? '<div class="ctile__co">' + esc(co) + '</div>' : '') + '</div>' +
        (function () { var pr = presence(c.lastSeen); return '<span class="ctile__dot' + (pr.online ? ' on' : '') + '" title="' + pr.label + '"></span>'; })() +
      '</div>' +
      (function () { var pr = presence(c.lastSeen); return '<div class="ctile__meta">' + (c.email ? esc(c.email) + ' · ' : '') + '<span style="color:' + (pr.online ? 'var(--green)' : 'var(--muted)') + (pr.online ? ';font-weight:600' : '') + '">' + pr.label + '</span></div>'; })() +
      '<div class="ctile__foot">' +
        (active ? '<span class="pill pill--done">actif</span>' : '<span class="pill">inactif</span>') +
        (unread > 0 ? '<span class="pill pill--a_valider">' + unread + ' message' + (unread > 1 ? 's' : '') + '</span>' : '') +
      '</div></div>';
  }
  function scan() { api('/api/clients/scan', { method: 'POST' }).then(function (r) { return r.json(); }).then(function (d) { toast((d.added || 0) + ' client(s) ajouté(s)'); renderClients(); }); }

  /* ── Nouveau client ── */
  function renderNewClient() {
    var domBoxes = [['partner', 'Partenaire créative'], ['website', 'Site web'], ['branding', 'Identité visuelle'], ['supports', 'Supports de com']]
      .map(function (d) { return '<label class="checkbox"><input type="checkbox" id="nc-dom-' + d[0] + '"> ' + d[1] + '</label>'; }).join('');
    setMain(topbar('Nouveau client', '<button class="btn btn--outline btn--sm" onclick="ADM.nav(\'clients\')">← Clients</button>') +
      '<div class="wrap"><div class="card" style="max-width:620px">' +
      '<h3>Coordonnées</h3>' +
      '<div class="grid grid--2">' +
      '<div class="field"><label>Prénom</label><input id="nc-prenom" class="inp"></div>' +
      '<div class="field"><label>Nom</label><input id="nc-nom" class="inp"></div>' +
      '<div class="field"><label>Email</label><input id="nc-email" class="inp" type="email"></div>' +
      '<div class="field"><label>Téléphone</label><input id="nc-tel" class="inp"></div>' +
      '</div>' +
      '<h3 class="mt">Société</h3>' +
      '<div class="grid grid--2">' +
      '<div class="field"><label>Nom société</label><input id="nc-ent-nom" class="inp"></div>' +
      '<div class="field"><label>Adresse</label><input id="nc-ent-adr" class="inp"></div>' +
      '<div class="field"><label>SIRET</label><input id="nc-ent-siret" class="inp"></div>' +
      '<div class="field"><label>TVA</label><input id="nc-ent-tva" class="inp"></div>' +
      '</div>' +
      '<h3 class="mt">Espaces actifs</h3><div class="row">' + domBoxes + '</div>' +
      '<div class="field mt" style="max-width:220px"><label>Forfait partenaire (h/mois)</label><input id="nc-forfait" class="inp" type="number" value="0"></div>' +
      '<div class="row row--end mt"><button class="btn btn--dark" id="nc-btn" onclick="ADM.createClient()">Créer l\'espace</button></div>' +
      '<div id="nc-result"></div>' +
      '</div></div>');
  }
  function createClient() {
    var domains = ['partner', 'website', 'branding', 'supports'].filter(function (d) { var e = el('nc-dom-' + d); return e && e.checked; });
    var body = {
      nom: el('nc-nom').value, prenom: el('nc-prenom').value, email: el('nc-email').value, telephone: el('nc-tel').value,
      entreprise: { nom: el('nc-ent-nom').value, adresse: el('nc-ent-adr').value, siret: el('nc-ent-siret').value, tva: el('nc-ent-tva').value },
      domains: domains, monthlyHours: Number(el('nc-forfait').value) || 0,
    };
    if (!body.nom && !body.email) { toast('Nom ou email requis'); return; }
    var btn = el('nc-btn'); btn.disabled = true;
    jpost('/api/clients', body).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); }).then(function (res) {
      if (!res.ok) { toast(res.d.error || 'Erreur'); btn.disabled = false; return; }
      el('nc-result').innerHTML = '<div class="card mt" style="background:var(--glycine-50)"><h3>Espace créé ✓</h3>' +
        '<p class="mb">Transmettez cette <strong>clé d\'accès</strong> au client (avec son email) :</p>' +
        '<div class="keybox">' + esc(res.d.key) + '</div>' +
        '<div class="row mt"><button class="btn btn--sm" onclick="ADM.copy(\'' + res.d.key + '\')">Copier</button>' +
        '<button class="btn btn--outline btn--sm" onclick="ADM.openClient(\'' + res.d.key + '\')">Ouvrir l\'espace</button></div></div>';
      btn.disabled = false;
    }).catch(function () { toast('Erreur réseau'); btn.disabled = false; });
  }
  function copy(t) { try { navigator.clipboard.writeText(t); toast('Copié'); } catch (e) { toast('Copie impossible'); } }
  function editToken() {
    jpost('/api/clients/' + CURKEY + '/edit-token', {}).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.etk) { toast('Erreur'); return; }
      copy('?edit=1&etk=' + d.etk);
      toast('Code copié — colle-le à la fin de l\'adresse de l\'espace client');
    }).catch(function () { toast('Erreur'); });
  }

  /* ── Détail client ── */
  function openClient(key) { CURKEY = key; VIEW = 'client'; TAB = 'infos'; renderShell(); loadClient(); }
  function loadClient(cb) {
    api('/api/clients/' + CURKEY).then(function (r) { return r.json(); }).then(function (d) { CUR = d; if (cb) cb(); else renderClient(); }).catch(showError);
  }
  // Rafraîchissement silencieux de la fiche client après une action réussie :
  // ne blanchit pas l'écran si le rechargement échoue (l'action a réussi).
  function refreshClient() {
    api('/api/clients/' + CURKEY).then(function (r) { return r.json(); }).then(function (d) { CUR = d; if (VIEW === 'client') renderClient(); }).catch(function () { });
  }
  function renderClient() {
    if (!CUR || CUR.key !== CURKEY) { setMain(topbar('Client') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>'); if (!CUR || CUR.key !== CURKEY) { loadClient(); } return; }
    var nm = ((CUR.client.prenom || '') + ' ' + (CUR.client.nom || '')).trim() || (CUR.entreprise.nom) || CUR.client.email || CUR.key;
    var tabs = [['infos', 'Infos', 0, true]];
    CUR.domains.forEach(function (dn) { tabs.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label, dn.unread || 0, dn.isActive !== false]); });
    CUR.supports.forEach(function (s) { tabs.push([s.id, s.label, s.unread || 0, s.isActive !== false]); });
    tabs.push(['journal', 'Journal', 0, true]);
    tabs.push(['documents', 'Documents', 0, true]);
    // Questionnaires envoyés à cette cliente. Badge = nb en attente de réponse.
    var qnrPending = (CUR.questionnaires || []).filter(function (q) { return q.status !== 'completed'; }).length;
    tabs.push(['qnranswers', 'Questionnaires', qnrPending, true]);
    // Le bilan ne concerne que la fin de collaboration : la section reste grisée
    // (mais accessible) tant que l'invitation au bilan n'a pas été demandée.
    var _partnerB = (CUR.domains || []).filter(function (x) { return x.id === 'partner'; })[0];
    var _bil = _partnerB && _partnerB.content && _partnerB.content.bilan;
    var bilanStarted = !!(_bil && (_bil.requestedAt || _bil.submittedAt));
    tabs.push(['bilanavis', 'Bilan & avis', 0, true, !bilanStarted]);
    var tabsHtml = tabs.map(function (t) {
      var muted = t[4];
      var st = !t[3] ? ' title="offre inactive" style="opacity:0.55"'
        : (muted ? ' title="Le bilan s\'active en fin de collaboration" style="opacity:0.5"' : '');
      return '<button class="tab' + (TAB === t[0] ? ' active' : '') + '" onclick="ADM.tab(\'' + t[0] + '\')"' + st + '>' + esc(t[1]) + (t[3] ? '' : ' ·') + badge(t[2]) + '</button>';
    }).join('');
    var ml = (CUR.meetingLink || '').trim();
    var visioBtn = ml ? '<a class="btn btn--dark btn--sm" href="' + esc(ml.indexOf('http') === 0 ? ml : 'https://' + ml) + '" target="_blank" rel="noopener" title="Ouvrir la salle de visioconférence">' + admIcon('video') + ' Rejoindre la visio</a>' : '';
    setMain(topbar(nm, visioBtn + '<button class="btn btn--outline btn--sm" onclick="ADM.nav(\'clients\')">← Clients</button>', presence(CUR.lastSeen).label) +
      '<div class="wrap">' + clientAlerts() + '<div class="tabs">' + tabsHtml + '</div><div id="tabbody"></div></div>');
    renderTab();
  }
  function clientAlerts() {
    var unread = 0, aValider = 0, review = 0, waitClient = 0;
    function scan(list) {
      (list || []).forEach(function (d) {
        var c = d.content || {}; unread += d.unread || 0;
        (c.livrables || []).forEach(function (l) { if (l.status === 'a_valider') aValider++; });
        (c.taches || []).forEach(function (t) { if (t.status === 'review') review++; });
        (c.suivi || []).forEach(function (s) { if (s.status === 'waiting_client') waitClient++; });
      });
    }
    scan(CUR.domains); scan(CUR.supports);
    var chips = [];
    if (unread) chips.push(['Vous', unread + ' message' + (unread > 1 ? 's' : '') + ' à lire', '#fbf0d8', '#8a4a0e']);
    if (review) chips.push(['Vous', review + ' tâche' + (review > 1 ? 's' : '') + ' à valider', '#fbf0d8', '#8a4a0e']);
    if (aValider) chips.push(['Client', aValider + ' livrable' + (aValider > 1 ? 's' : '') + ' en attente de sa validation', '#efe6fb', '#6c4ea4']);
    if (waitClient) chips.push(['Client', waitClient + ' étape' + (waitClient > 1 ? 's' : '') + ' en attente de lui', '#efe6fb', '#6c4ea4']);
    if (!chips.length) return '<div class="card" style="background:#f0f6ee;border-color:#cfe0c6;max-width:none"><span class="micro" style="color:#5d7a52;font-weight:700;letter-spacing:0.04em">✓ Tout est à jour pour ce client</span></div>';
    return '<div class="card" style="max-width:none"><div class="micro mb" style="font-weight:700;color:var(--terre);text-transform:uppercase;letter-spacing:0.05em">Ce qui attend</div><div class="row" style="gap:8px;flex-wrap:wrap">' +
      chips.map(function (ch) { return '<span style="display:inline-flex;align-items:center;gap:7px;padding:6px 13px;border-radius:999px;background:' + ch[2] + ';color:' + ch[3] + ';font-size:12.5px;font-weight:600"><span style="font-size:9px;text-transform:uppercase;letter-spacing:0.06em;opacity:0.7">' + ch[0] + '</span>' + esc(ch[1]) + '</span>'; }).join('') + '</div></div>';
  }
  function tab(t) { TAB = t; if (CURKEY) TAB_BY_CLIENT[CURKEY] = t; renderClient(); renderNav(); }

  // Journal de projet : frise automatique des événements de la cliente, dérivée
  // des dates déjà présentes (tâches, livrables, étapes, tickets, questionnaires).
  function journalTab() {
    var ev = [];
    function add(at, icon, title, sub, color) { if (!at) return; ev.push({ at: String(at), icon: icon, title: title, sub: sub || '', color: color || '#6b533b' }); }
    function scan(list) {
      (list || []).forEach(function (dn) {
        var c = dn.content || {}; var lbl = DOMAIN_LABELS[dn.id] || dn.label || '';
        (c.taches || []).forEach(function (t) {
          add(t.createdAt, '📝', 'Tâche créée · ' + (t.title || ''), lbl, '#35608f');
          if (t.completedAt) add(t.completedAt, '✅', 'Tâche terminée · ' + (t.title || ''), lbl, '#3f6b3a');
          (t.reviewHistory || []).forEach(function (h) { add(h.at, '🔗', 'Lien de révision envoyé · ' + (t.title || ''), lbl, '#8a6f2e'); });
          (t.comments || []).forEach(function (cm) { add(cm.at || cm.date || cm.createdAt, '💬', 'Commentaire' + (cm.author === 'client' ? ' de la cliente' : ''), t.title || '', '#6c4ea4'); });
          if (t.proposedDueDate && t.proposedAt) add(t.proposedAt, '📅', 'Report de date proposé · ' + (t.title || ''), lbl, '#8a4a0e');
        });
        (c.livrables || []).forEach(function (l) {
          add(l.createdAt, '📦', 'Livrable envoyé · ' + (l.name || ''), lbl, '#5e3fa0');
          if (l.validatedAt) {
            if (l.status === 'valide') add(l.validatedAt, '🎉', 'Livrable validé · ' + (l.name || ''), lbl, '#3f6b3a');
            else if (l.status === 'refuse' || l.status === 'revision') add(l.validatedAt, '↩️', 'Révision demandée · ' + (l.name || ''), l.clientComment || lbl, '#a23c28');
          }
        });
        (c.suivi || []).forEach(function (s) { if (s.completedAt) add(s.completedAt, '✅', 'Étape terminée · ' + (s.title || ''), lbl, '#3f6b3a'); });
        (c.tickets || []).forEach(function (t) { add(t.createdAt, '🎫', 'Ticket ouvert · ' + (t.title || ''), lbl, '#8a4a0e'); if (t.resolvedAt) add(t.resolvedAt, '✅', 'Ticket résolu · ' + (t.title || ''), lbl, '#3f6b3a'); });
        if (c.bilan && c.bilan.submittedAt) add(c.bilan.submittedAt, '⭐', 'Bilan de fin rempli', lbl, '#9c6f18');
      });
    }
    scan(CUR.domains); scan(CUR.supports);
    (CUR.questionnaires || []).forEach(function (q) {
      add(q.assignedAt, '📋', 'Questionnaire envoyé · ' + (q.name || ''), '', '#5e3fa0');
      if (q.completedAt) add(q.completedAt, '✨', 'Questionnaire complété · ' + (q.name || ''), '', '#3f6b3a');
    });
    ev.sort(function (a, b) { return b.at.localeCompare(a.at); });
    if (!ev.length) return '<div class="card infocard" style="background:var(--card)"><h3>Journal</h3><div class="empty">Aucun événement pour l\'instant. Les actions (tâches, livrables, questionnaires, tickets…) apparaîtront ici automatiquement.</div></div>';
    ev = ev.slice(0, 200);
    // Regroupement par jour
    var out = '', lastDay = '';
    ev.forEach(function (e) {
      var day = e.at.slice(0, 10);
      if (day !== lastDay) {
        lastDay = day;
        out += '<div style="font-family:var(--font-micro);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin:18px 0 8px">' + esc(fmtDate(e.at)) + '</div>';
      }
      out += '<div style="display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--bone-d)">' +
        '<div style="flex-shrink:0;font-size:16px;width:26px;text-align:center;line-height:1.4">' + e.icon + '</div>' +
        '<div style="flex:1;min-width:0"><div style="font-size:14px;color:var(--terre);font-weight:500;line-height:1.35">' + esc(e.title) + '</div>' +
          (e.sub ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:2px">' + esc(e.sub) + '</div>' : '') + '</div>' +
        '<div style="flex-shrink:0;font-family:var(--font-micro);font-size:10px;color:var(--muted);padding-top:3px">' + esc(fmtDT(e.at).split(' ')[1] || '') + '</div>' +
      '</div>';
    });
    return '<div class="card infocard" style="background:var(--card)"><h3>Journal de projet</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--terre-600)">Tout ce qui s\'est passé, du plus récent au plus ancien. Idéal pour reprendre le dossier en quelques secondes.</div>' +
      out + '</div>';
  }

  function findDomain(id) { if (!CUR) return null; var d = (CUR.domains || []).filter(function (x) { return x.id === id; })[0]; if (d) return d; return (CUR.supports || []).filter(function (x) { return x.id === id; })[0] || null; }

  function renderTab() {
    var body = el('tabbody'); if (!body) return;
    if (TAB === 'infos') return body.innerHTML = tabInfos();
    if (TAB === 'journal') return body.innerHTML = journalTab();
    if (TAB === 'documents') return renderDocuments(body);
    if (TAB === 'qnranswers') { qnrMarkSeen(); return body.innerHTML = qnrAnswersTab(); }
    if (TAB === 'bilanavis') return body.innerHTML = bilanAvisTab();
    var d = findDomain(TAB);
    if (!d) { body.innerHTML = '<div class="empty">·</div>'; return; }
    var secs = sectionsFor(d);
    var keys = secs.map(function (x) { return x[0]; });
    var cur = SUBTAB[d.id]; if (keys.indexOf(cur) === -1) cur = keys[0];
    var subnav = '<div class="subtabs">' + secs.map(function (x) {
      return '<button class="subtab' + (cur === x[0] ? ' active' : '') + '" onclick="ADM.subtab(\'' + d.id + '\',\'' + x[0] + '\')">' + esc(x[1]) + (x[2] > 0 ? ' ' + badge(x[2]) : '') + '</button>';
    }).join('') + '</div>';
    var content = '';
    if (cur === 'tickets') content = maintTickets(d);
    else if (cur === 'creations') content = creationsGallery(d);
    else if (cur === 'forfait') content = partnerForfait(d);
    else if (cur === 'taches') content = partnerTasks(d);
    else if (cur === 'questionnaire') content = questionnaireCard(d);
    else if (cur === 'bilan') content = bilanCard(d);
    else if (cur === 'suivi') content = suiviCard(d);
    else if (cur === 'liv') content = livrablesCard(d);
    else content = chatCard(d);
    body.innerHTML = subnav + content;
    var box = el('chat-' + d.id); if (box) box.scrollTop = box.scrollHeight;
    if (cur === 'msg' && d.unread > 0) { jpost('/api/clients/' + CURKEY + '/message/read', { projectId: d.id }, 'POST'); d.unread = 0; renderClient(); }
    if (cur === 'tickets' && Array.isArray(d.content.tickets) && d.content.tickets.some(function (t) { return t.seenByAdmin === false; })) {
      jpost('/api/clients/' + CURKEY + '/tickets/seen', { projectId: d.id }, 'POST');
      d.content.tickets.forEach(function (t) { t.seenByAdmin = true; });
    }
  }
  function sectionsFor(d) {
    var s = [];
    var qn = (d.content.questionnaire || []).length;
    if (d.id === 'maintenance') {
      var tks = Array.isArray(d.content.tickets) ? d.content.tickets : [];
      var unseen = tks.filter(function (t) { return t.seenByAdmin === false; }).length;
      s.push(['tickets', 'Tickets', unseen]);
      s.push(['questionnaire', 'Questionnaire', qn]);
      s.push(['msg', 'Messages', d.unread || 0]);
      return s;
    }
    var isSupport = /^support-/.test(d.id);
    // Support de com = portfolio de créations : la galerie « Créations » remplace
    // les « Étapes » (un support n'a pas de déroulé fixe). Les versions vivent
    // dans les créations, donc pas de sous-onglet « Livrables » séparé non plus.
    if (isSupport) s.push(['creations', 'Créations', (d.content.creations || []).length]);
    if (d.id === 'partner') { s.push(['forfait', 'Forfait', 0]); s.push(['taches', 'Tâches', (d.content.taches || []).length]); }
    if (d.content.suivi !== undefined && !isSupport) s.push(['suivi', 'Étapes', (d.content.suivi || []).length]);
    if (Array.isArray(d.content.livrables) && !isSupport) s.push(['liv', 'Livrables', (d.content.livrables || []).length]);
    s.push(['questionnaire', 'Questionnaire', qn]);
    s.push(['msg', 'Messages', d.unread || 0]);
    return s;
  }
  function subtab(domId, key) { SUBTAB[domId] = key; renderTab(); }

  // ── Questionnaire d'un projet : Cindy crée les questions, la cliente répond ──
  var QN_TYPE_LBL = { section: 'Titre de section', short: 'Réponse courte', long: 'Réponse longue', choice: 'Choix simple', multi: 'Choix multiple', rank: 'Classement (1, 2, 3…)' };
  function qnAnsText(a) {
    if (a == null) return '';
    if (Array.isArray(a)) return a.join(', ');
    if (typeof a === 'object') { return Object.keys(a).sort(function (x, y) { return (parseInt(a[x], 10) || 99) - (parseInt(a[y], 10) || 99); }).map(function (k) { return a[k] + '. ' + k; }).join('   ·   '); }
    return String(a);
  }
  function questionnaireCard(d) {
    var items = Array.isArray(d.content.questionnaire) ? d.content.questionnaire : [];
    var answers = (d.content.questionnaireAnswers && typeof d.content.questionnaireAnswers === 'object') ? d.content.questionnaireAnswers : {};
    var title = d.content.questionnaireTitle || '';
    var ready = d.content.questionnaireReady === true;
    function row(q, idx) {
      var isSec = q.type === 'section';
      var withOpts = q.type === 'choice' || q.type === 'multi' || q.type === 'rank';
      var sel = Object.keys(QN_TYPE_LBL).map(function (t) { return '<option value="' + t + '"' + ((q.type || 'long') === t ? ' selected' : '') + '>' + QN_TYPE_LBL[t] + '</option>'; }).join('');
      var ansTxt = qnAnsText(answers[q.id]);
      return '<div class="card" style="background:' + (isSec ? 'var(--surface-2,#f3ede1)' : 'var(--card)') + ';padding:12px 14px;margin-bottom:8px">' +
        '<div class="row" style="gap:8px;align-items:center;margin-bottom:8px">' +
          '<select class="inp" style="width:auto" onchange="ADM.qnSet(\'' + d.id + '\',\'' + q.id + '\',\'type\',this.value)">' + sel + '</select>' +
          '<input class="inp" value="' + esc(q.label || '') + '" placeholder="' + (isSec ? 'Titre de la section (ex. Priorités business)' : 'Votre question') + '" style="flex:1;font-weight:600" onchange="ADM.qnSet(\'' + d.id + '\',\'' + q.id + '\',\'label\',this.value)">' +
          '<button class="pbtn" title="Monter"' + (idx === 0 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.qnMove(\'' + d.id + '\',\'' + q.id + '\',-1)">↑</button>' +
          '<button class="pbtn" title="Descendre"' + (idx === items.length - 1 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.qnMove(\'' + d.id + '\',\'' + q.id + '\',1)">↓</button>' +
          '<button class="pbtn" style="color:#c44" onclick="ADM.qnDel(\'' + d.id + '\',\'' + q.id + '\')">×</button>' +
        '</div>' +
        '<textarea class="inp" placeholder="Aide / précisions (exemples…) — optionnel" style="width:100%;box-sizing:border-box;min-height:40px;resize:vertical;font-size:13px" onchange="ADM.qnSet(\'' + d.id + '\',\'' + q.id + '\',\'help\',this.value)">' + esc(q.help || '') + '</textarea>' +
        (withOpts ? '<div style="margin-top:8px"><div class="micro" style="text-transform:none;letter-spacing:0;margin-bottom:3px">Choix proposés (une ligne = un choix)</div><textarea class="inp" style="width:100%;box-sizing:border-box;min-height:64px;resize:vertical;font-size:13px" placeholder="Mariage\nChef à domicile\nBuffets…" onchange="ADM.qnSetOptions(\'' + d.id + '\',\'' + q.id + '\',this.value)">' + esc((q.options || []).join('\n')) + '</textarea></div>' : '') +
        (!isSec && ansTxt ? '<div style="margin-top:8px;background:#eef4ea;border:1px solid #cfe0c6;border-radius:8px;padding:8px 10px;font-size:13px;color:var(--terre);white-space:pre-wrap"><span class="micro" style="text-transform:none;letter-spacing:0;color:#3f5a37;display:block;margin-bottom:3px">Réponse de la cliente</span>' + esc(ansTxt) + '</div>' : '') +
      '</div>';
    }
    var list = items.length ? items.map(row).join('') : '<div class="empty">Aucune question. Ajoute-en une, ou colle ton questionnaire en un clic.</div>';
    var nQ = items.filter(function (q) { return q.type !== 'section'; }).length;
    var nAns = items.filter(function (q) { return q.type !== 'section' && qnAnsText(answers[q.id]).trim(); }).length;
    var head = '<div class="card" style="background:var(--card);padding:18px 20px;margin-bottom:14px">' +
      '<div class="between"><h3 style="margin:0"><span class="infocard__dot" style="background:#5e3fa0"></span>Questionnaire</h3>' +
        '<div class="row" style="gap:8px;flex-wrap:wrap">' +
          (items.length ? '<button class="btn btn--outline btn--sm" onclick="ADM.qnPreview(\'' + d.id + '\')">👁 Prévisualiser</button>' : '') +
          '<button class="btn btn--outline btn--sm" onclick="ADM.qnBulk(\'' + d.id + '\')">📋 Coller</button>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.qnAdd(\'' + d.id + '\',\'section\')">+ Section</button>' +
          '<button class="btn btn--dark btn--sm" onclick="ADM.qnAdd(\'' + d.id + '\',\'long\')">+ Question</button>' +
        '</div>' +
      '</div>' +
      '<div class="field mt"><label>Titre du questionnaire (affiché à la cliente)</label><input class="inp" value="' + esc(title) + '" placeholder="Ex. Questionnaire de démarrage, Questionnaire final…" onchange="ADM.qnSetTitle(\'' + d.id + '\',this.value)"></div>' +
      '<div class="row mt" style="align-items:center;gap:12px;flex-wrap:wrap">' +
        '<label class="checkbox' + (ready ? ' is-on' : '') + '"><input type="checkbox"' + (ready ? ' checked' : '') + ' onchange="ADM.qnSetReady(\'' + d.id + '\',this.checked)"> ' + (ready ? 'visible par la cliente' : 'masqué (en préparation)') + '</label>' +
        '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">' + (ready ? 'La cliente le voit dans son espace.' : 'Coche pour le publier : la cliente sera prévenue par e-mail.') + (nQ ? ' · ' + nAns + ' / ' + nQ + ' réponse' + (nQ > 1 ? 's' : '') : '') + '</span>' +
      '</div></div>';
    return head + list;
  }
  function qnList(d) { if (!Array.isArray(d.content.questionnaire)) d.content.questionnaire = []; return d.content.questionnaire; }
  function qnSaveAll(domId) { var d = findDomain(domId); if (!d) return; jpost('/api/clients/' + CURKEY + '/questionnaire', { projectId: domId, questions: d.content.questionnaire }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement'); }); }
  function qnAdd(domId, type) { var d = findDomain(domId); if (!d) return; qnList(d).push({ id: 'q' + Date.now().toString(36), type: type || 'long', label: '', help: '' }); qnSaveAll(domId); renderTab(); }
  function qnSet(domId, qid, field, val) { var d = findDomain(domId); if (!d) return; qnList(d).forEach(function (q) { if (q.id === qid) q[field] = val; }); qnSaveAll(domId); if (field === 'type') renderTab(); }
  function qnDel(domId, qid) { var d = findDomain(domId); if (!d) return; d.content.questionnaire = qnList(d).filter(function (q) { return q.id !== qid; }); qnSaveAll(domId); renderTab(); }
  function qnSetOptions(domId, qid, text) { var d = findDomain(domId); if (!d) return; var opts = String(text || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean); qnList(d).forEach(function (q) { if (q.id === qid) q.options = opts; }); qnSaveAll(domId); }
  function qnSetTitle(domId, val) { var d = findDomain(domId); if (!d) return; d.content.questionnaireTitle = val; jpost('/api/clients/' + CURKEY + '/questionnaire', { projectId: domId, title: val }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur'); }); }
  function qnSetReady(domId, on) {
    var d = findDomain(domId); if (!d) return;
    function apply(notify) { d.content.questionnaireReady = !!on; jpost('/api/clients/' + CURKEY + '/questionnaire', { projectId: domId, ready: !!on, notify: notify }, 'PATCH').then(function (r) { if (r.ok) { toast(on ? ('Questionnaire publié' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')) : 'Questionnaire masqué'); renderTab(); } else toast('Erreur'); }); }
    if (on) { notifyConfirm('Publier le questionnaire et prévenir la cliente par e-mail ?', apply); }
    else { apply(false); }
  }
  function qnPreview(domId) {
    var d = findDomain(domId); if (!d) return; var items = qnList(d);
    var title = (d.content.questionnaireTitle || '').trim() || 'Questionnaire';
    var body = items.map(function (q) {
      var opts = q.options || [];
      if (q.type === 'section') return '<div style="margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid var(--bone-d)"><div style="font-family:var(--font-display);font-style:italic;font-size:20px;color:var(--terre)">' + esc(q.label) + '</div>' + (q.help ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:5px;white-space:pre-wrap">' + esc(q.help) + '</div>' : '') + '</div>';
      var lab = '<div style="font-size:14px;font-weight:600;color:var(--terre);margin-bottom:5px">' + esc(q.label) + '</div>' + (q.help ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-bottom:7px;white-space:pre-wrap">' + esc(q.help) + '</div>' : '');
      var inp;
      if (q.type === 'short') inp = '<input class="inp" disabled placeholder="Réponse courte…" style="width:100%;box-sizing:border-box">';
      else if (q.type === 'choice') inp = opts.map(function (o) { return '<label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1.5px solid var(--bone-d);border-radius:9px;margin-bottom:6px;color:var(--terre)"><input type="radio" disabled>' + esc(o) + '</label>'; }).join('') || '<div class="micro">(ajoute des choix)</div>';
      else if (q.type === 'multi') inp = opts.map(function (o) { return '<label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1.5px solid var(--bone-d);border-radius:9px;margin-bottom:6px;color:var(--terre)"><input type="checkbox" disabled>' + esc(o) + '</label>'; }).join('') || '<div class="micro">(ajoute des choix)</div>';
      else if (q.type === 'rank') inp = opts.map(function (o) { return '<div style="display:flex;align-items:center;gap:10px;padding:4px 0"><input class="inp" disabled style="width:52px;text-align:center" placeholder="#"><span style="color:var(--terre)">' + esc(o) + '</span></div>'; }).join('') || '<div class="micro">(ajoute des éléments à classer)</div>';
      else inp = '<textarea class="inp" disabled rows="3" placeholder="Réponse…" style="width:100%;box-sizing:border-box"></textarea>';
      return '<div style="margin-bottom:16px">' + lab + inp + '</div>';
    }).join('');
    var ov = document.createElement('div'); ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:600px;text-align:left;max-height:88vh;overflow-y:auto">' +
      '<div class="micro" style="letter-spacing:0.06em">Aperçu — tel que la cliente le voit</div>' +
      '<div style="font-family:var(--font-display);font-style:italic;font-size:24px;color:var(--terre);margin:2px 0 16px">' + esc(title) + '</div>' +
      (body || '<div class="empty">Aucune question.</div>') +
      '<div class="admconfirm__row"><button class="btn btn--sm" data-no style="background:var(--terre);color:#fff;border-color:var(--terre)">Fermer</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    document.body.appendChild(ov);
  }
  function qnMove(domId, qid, dir) { var d = findDomain(domId); if (!d) return; var a = qnList(d); var i = a.findIndex(function (q) { return q.id === qid; }); if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return; var t = a[i]; a[i] = a[j]; a[j] = t; qnSaveAll(domId); renderTab(); }
  function qnParse(text) {
    var lines = String(text || '').split('\n'); var items = []; var n = 0;
    function nid() { n++; return 'q' + Date.now().toString(36) + n; }
    lines.forEach(function (raw) {
      var t = raw.trim(); if (!t) return;
      if (/^\d+[\.\)]\s+/.test(t)) { items.push({ id: nid(), type: 'section', label: t.replace(/^\d+[\.\)]\s+/, ''), help: '' }); return; }
      if (/\?$/.test(t)) { items.push({ id: nid(), type: 'long', label: t, help: '' }); return; }
      var last = items[items.length - 1];
      if (last) { last.help = last.help ? last.help + '\n' + t : t; }
      else { items.push({ id: nid(), type: 'long', label: t, help: '' }); }
    });
    return items;
  }
  function qnBulk(domId) {
    var ov = document.createElement('div'); ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:640px;text-align:left">' +
      '<div class="admconfirm__title">Coller un questionnaire</div>' +
      '<div class="admconfirm__msg">Colle ton texte. Les lignes « 1. Titre » deviennent des <b>sections</b>, celles qui finissent par « ? » deviennent des <b>questions</b>, le reste devient l\'<b>aide</b> de la question au-dessus. Tu pourras tout ajuster après.</div>' +
      '<textarea class="inp" id="qn-bulk" style="width:100%;box-sizing:border-box;min-height:260px;resize:vertical" placeholder="1. Priorités business\nParmi ces prestations, lesquelles veux-tu développer ?\nMariage\nChef à domicile…"></textarea>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button><button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Importer</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var txt = (el('qn-bulk') || {}).value || ''; var items = qnParse(txt); if (!items.length) { toast('Rien à importer'); return; }
      var d = findDomain(domId); if (d) { var arr = qnList(d); items.forEach(function (it) { arr.push(it); }); qnSaveAll(domId); }
      close(); renderTab(); toast(items.length + ' élément' + (items.length > 1 ? 's' : '') + ' importé' + (items.length > 1 ? 's' : ''));
    };
    document.body.appendChild(ov); var t = el('qn-bulk'); if (t) t.focus();
  }

  function tabInfos() {
    var c = CUR.client, e = CUR.entreprise;
    var active = CUR.isActive;
    var coord = '<div class="card infocard" style="background:var(--card)">' +
      '<div class="between mb"><h3><span class="infocard__dot" style="background:#5e3fa0"></span>Coordonnées</h3>' +
      '<label class="checkbox infocard__act' + (active ? ' is-on' : '') + '"><input type="checkbox" id="inf-active"' + (active ? ' checked' : '') + ' onchange="ADM.saveInfos()"> ' + (active ? 'espace actif' : 'espace inactif') + '</label></div>' +
      '<div class="grid grid--2">' +
      fld('inf-prenom', 'Prénom', c.prenom) + fld('inf-nom', 'Nom', c.nom) +
      fld('inf-email', 'Email', c.email) + fld('inf-tel', 'Téléphone', c.telephone) +
      fld('inf-ent-nom', 'Société', e.nom) + fld('inf-ent-adr', 'Adresse', e.adresse) +
      fld('inf-ent-siret', 'SIRET', e.siret) + fld('inf-ent-tva', 'TVA', e.tva) +
      '</div>' +
      '<div class="field mt"><label>Lien visio (bouton « Rejoindre la visio » dans son espace)</label>' +
        '<input id="inf-visio" class="inp" value="' + esc(CUR.meetingLink || '') + '" placeholder="https://kmeet.infomaniak.com/… (colle le lien de ta salle)"></div>' +
      '<div class="micro" style="margin-top:5px">Laisse vide pour masquer le bouton. Crée la salle sur Infomaniak kMeet et colle le lien ici.</div>' +
      '<div class="row row--end mt"><button class="btn btn--dark btn--sm" onclick="ADM.saveInfos()">Enregistrer</button></div>' +
      '<div class="micro mt">Clé d\'accès : <span class="keybox" style="display:inline-block;padding:3px 8px">' + esc(CUR.key) + '</span></div>' +
      '<div class="row mt" style="align-items:center;gap:10px"><button class="btn btn--outline btn--sm" onclick="ADM.editToken()">Copier le code du mode édition (24 h)</button>' +
      '<span class="micro" style="text-transform:none;letter-spacing:0">À coller à la fin de l\'adresse de l\'espace client pour activer le mode édition.</span></div></div>';
    var danger = '<div class="card infocard" style="background:#fbf1ee">' +
      '<h3 style="color:#b5462f"><span class="infocard__dot" style="background:#b5462f"></span>Zone sensible</h3>' +
      '<div class="micro mb">Supprime définitivement ce client : son espace, ses messages, ses tâches et ses fichiers. Action irréversible.</div>' +
      '<button class="btn btn--danger btn--sm" onclick="ADM.deleteClient()">Supprimer ce client et son espace</button></div>';
    return '<div class="grid grid--2" style="align-items:start;max-width:1100px">' +
      '<div>' + coord + supportsCard() + '</div>' +
      '<div>' + offersCard() + ticketsSpaceCard() + '</div>' +
      '</div>' + danger;
  }
  function ticketsSpaceCard() {
    var dm = (CUR.domains || []).filter(function (x) { return x.id === 'maintenance'; })[0];
    var on = !!(dm && dm.isActive !== false);
    var nTk = dm && dm.content && Array.isArray(dm.content.tickets) ? dm.content.tickets.length : 0;
    return '<div class="card infocard" style="background:var(--card)"><h3><span class="infocard__dot" style="background:#9c6f18"></span>Espace tickets</h3>' +
      '<div class="micro mb">Un espace simple où la cliente ouvre des tickets (bug, modification, ajout de contenu…), indique pour quand elle le souhaite et suit leur avancement. Idéal pour la maintenance d\'un site.</div>' +
      '<label class="checkbox infocard__act' + (on ? ' is-on' : '') + '"><input type="checkbox"' + (on ? ' checked' : '') + ' onchange="ADM.toggleTicketsSpace(this.checked)"> ' + (on ? 'espace tickets activé' : 'espace tickets désactivé') + '</label>' +
      (on ? '<div class="micro mt" style="text-transform:none;letter-spacing:0;color:var(--muted)">' + nTk + ' ticket' + (nTk > 1 ? 's' : '') + ' · gère-les dans l\'onglet « Espace tickets » ci-dessus.</div>' : '') +
      '</div>';
  }
  function deleteClient() {
    var nm = ((CUR.client.prenom || '') + ' ' + (CUR.client.nom || '')).trim() || CUR.client.email || CUR.key;
    admConfirm({
      title: 'Supprimer « ' + nm + ' » ?',
      message: 'Tout son espace sera supprimé : projets, messages, livrables et fichiers.',
      detail: 'Cette action est irréversible.',
      yes: 'Continuer', no: 'Non, annuler', danger: true,
    }, function () {
      admConfirm({
        title: 'Dernière confirmation',
        message: 'Tout sera effacé définitivement, fichiers compris. Es-tu sûre ?',
        yes: 'Oui, tout supprimer', no: 'Non, annuler', danger: true,
      }, function () {
        api('/api/clients/' + CURKEY, { method: 'DELETE' }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) { if (res.ok) { toast('Client supprimé'); nav('clients'); } else toast((res.d && res.d.error) || 'Erreur'); })
          .catch(function () { toast('Erreur'); });
      });
    });
  }
  var CR_TYPES = [['print', 'Print'], ['digital', 'Digital'], ['reseaux', 'Réseaux sociaux'], ['evenementiel', 'Événementiel'], ['autre', 'Autre']];
  var CR_STATUSES = [['a_preparer', 'À préparer'], ['en_creation', 'En création'], ['attente_client', 'Attente cliente'], ['revision', 'En révision'], ['valide', 'Validé'], ['archive', 'Archivé']];
  // Couleur d'identité par catégorie : [encre, fond teinté] pour différencier les cards.
  var CR_TYCOL = { print: ['#a35a1a', '#fbeee0'], digital: ['#35608f', '#e7eff9'], reseaux: ['#6c4ea4', '#f1ecfa'], evenementiel: ['#4f6a46', '#e8f0e3'], autre: ['#9c6f18', '#f6ecd5'] };
  function crOpts(list, cur) { return list.map(function (o) { return '<option value="' + o[0] + '"' + (cur === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join(''); }
  function supportCreationsBlock(s) {
    var pid = s.pid;
    var creations = (s.content && Array.isArray(s.content.creations)) ? s.content.creations : [];
    var livr = (s.content && Array.isArray(s.content.livrables)) ? s.content.livrables : [];
    var crRows = creations.map(function (c) {
      var vs = livr.filter(function (l) { return l.creationId === c.id; }).slice().sort(function (a, b) { return String(a.createdAt || '').localeCompare(String(b.createdAt || '')); });
      var vHtml = vs.map(function (l, i) {
        var lnk = l.reviewLink ? (/^https?:\/\//i.test(l.reviewLink) ? l.reviewLink : 'https://' + l.reviewLink) : '';
        return '<div class="file" style="gap:8px;font-size:12.5px"><span class="nm"><strong style="font-family:var(--font-micro);font-size:10px">V' + (i + 1) + '</strong> ' + esc(l.name) + ' ' + pill(l.status, ({ a_valider: 'à valider', valide: 'validé', refuse: 'à revoir', revision: 'à revoir' })[l.status] || l.status) + '</span>' +
          (l.fileKey ? '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(l.fileKey) + '/download">↓</a>' : '') +
          (lnk ? '<a class="btn btn--outline btn--sm" href="' + esc(lnk) + '" target="_blank" rel="noopener">🔗</a>' : '') +
          '<button class="btn btn--danger btn--sm" onclick="ADM.crDelVersion(\'' + pid + '\',\'' + l.id + '\')">✕</button></div>';
      }).join('');
      return '<div style="border:1px solid var(--bone-d);border-radius:10px;padding:11px;margin-top:8px;background:#faf7f0">' +
        '<div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">' +
          '<input class="inp" value="' + esc(c.name) + '" onchange="ADM.crSet(\'' + pid + '\',\'' + c.id + '\',\'name\',this.value)" style="flex:1;min-width:140px" title="Nom de la création">' +
          '<select class="inp" onchange="ADM.crSet(\'' + pid + '\',\'' + c.id + '\',\'type\',this.value)" style="width:auto" title="Catégorie">' + crOpts(CR_TYPES, c.type) + '</select>' +
          '<select class="inp" onchange="ADM.crSet(\'' + pid + '\',\'' + c.id + '\',\'status\',this.value)" style="width:auto" title="Statut">' + crOpts(CR_STATUSES, c.status) + '</select>' +
          '<button class="btn btn--danger btn--sm" onclick="ADM.crDel(\'' + pid + '\',\'' + c.id + '\')">Suppr.</button>' +
        '</div>' +
        (vHtml ? '<div style="margin-top:8px">' + vHtml + '</div>' : '') +
        '<div class="row" style="gap:6px;margin-top:8px">' +
          '<button class="btn btn--dark btn--sm" onclick="ADM.crAddVersion(\'' + pid + '\',\'' + c.id + '\')">+ Version (fichier)</button>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.crAddVersionLink(\'' + pid + '\',\'' + c.id + '\')">🔗 Version (lien)</button>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div style="margin-top:10px">' +
      '<div class="micro" style="text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:2px">Créations</div>' +
      (crRows || '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">Aucune création. Ajoutez-en une (flyer, carte de visite, brochure…).</div>') +
      '<div class="row" style="gap:6px;margin-top:8px"><input class="inp" id="cr-new-' + pid + '" placeholder="Nom de la création (ex. Flyer)" style="flex:1" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.crAdd(\'' + pid + '\');}"><button class="btn btn--dark btn--sm" onclick="ADM.crAdd(\'' + pid + '\')">+ Créer</button></div>' +
    '</div>';
  }
  var CR_ST_COL = { a_preparer: '#8a7d6b', en_creation: '#35608f', attente_client: '#c9952f', revision: '#c0533b', valide: '#3f8f5b', archive: '#8a7d6b' };
  function crStatusLabel(st) { for (var i = 0; i < CR_STATUSES.length; i++) if (CR_STATUSES[i][0] === st) return CR_STATUSES[i][1]; return st; }
  // Galerie des créations d'un projet de com (onglet « Support de com »).
  function creationsGallery(d) {
    var pid = d.pid;
    var creations = Array.isArray(d.content.creations) ? d.content.creations : [];
    var livr = Array.isArray(d.content.livrables) ? d.content.livrables : [];
    function verRow(l, i) {
      var lnk = l.reviewLink ? (/^https?:\/\//i.test(l.reviewLink) ? l.reviewLink : 'https://' + l.reviewLink) : '';
      var stl = ({ a_valider: 'à valider', valide: 'validé', refuse: 'à revoir', revision: 'à revoir' })[l.status] || l.status;
      var row = '<div style="display:flex;align-items:center;gap:6px;font-size:12.5px;padding:3px 0">' +
        '<strong style="font-family:var(--font-micro);font-size:10px;flex-shrink:0">V' + (i + 1) + '</strong>' +
        '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(l.name) + '</span>' +
        pill(l.status, stl) +
        (l.fileKey ? '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(l.fileKey) + '/download" title="Télécharger">↓</a>' : '') +
        (lnk ? '<a class="btn btn--outline btn--sm" href="' + esc(lnk) + '" target="_blank" rel="noopener" title="Ouvrir">🔗</a>' : '') +
        '<button class="btn btn--danger btn--sm" onclick="ADM.crDelVersion(\'' + pid + '\',\'' + l.id + '\')" title="Retirer">✕</button>' +
      '</div>';
      // Retour de la cliente (demande de révision) : message + fichiers + lien.
      var fb = '';
      var atts = Array.isArray(l.clientAttachments) ? l.clientAttachments : [];
      if ((l.status === 'refuse' || l.status === 'revision') && (l.clientComment || atts.length || l.clientLink)) {
        var attHtml = atts.map(function (a) { return '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank">📎 ' + esc(a.name || 'fichier') + '</a>'; }).join('');
        var lkHtml = l.clientLink ? '<a class="btn btn--outline btn--sm" href="' + esc(/^https?:\/\//i.test(l.clientLink) ? l.clientLink : 'https://' + l.clientLink) + '" target="_blank" rel="noopener">🔗 Lien</a>' : '';
        fb = '<div style="margin:2px 0 6px;padding:11px 13px;background:#fbeae5;border:1px solid #f0d3c9;border-radius:10px">' +
          '<div style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#9b3a2e;margin-bottom:5px">Retour de la cliente</div>' +
          (l.clientComment ? '<div style="font-size:13px;color:#7a2e1e;white-space:pre-wrap;line-height:1.5">' + esc(l.clientComment) + '</div>' : '') +
          ((attHtml || lkHtml) ? '<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">' + attHtml + lkHtml + '</div>' : '') +
        '</div>';
      }
      return row + fb;
    }
    function card(c) {
      var vs = livr.filter(function (l) { return l.creationId === c.id; }).slice().sort(function (a, b) { return String(a.createdAt || '').localeCompare(String(b.createdAt || '')); });
      var col = CR_ST_COL[c.status] || '#8a7d6b';
      var ty = CR_TYCOL[c.type] || ['#8a7d6b', '#f7f3ee'];
      var vHtml = vs.length ? vs.map(verRow).join('') : '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);padding:5px 0">Aucune version. Dépose la V1 ci-dessous.</div>';
      return '<div style="border:1px solid ' + ty[0] + '30;border-radius:16px;background:' + ty[1] + ';padding:24px;display:flex;flex-direction:column;gap:18px;box-shadow:0 10px 30px -18px ' + ty[0] + '66">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">' +
          '<input class="inp" value="' + esc(c.name) + '" onchange="ADM.crSet(\'' + pid + '\',\'' + c.id + '\',\'name\',this.value)" style="flex:1;min-width:0;font-family:var(--font-display);font-style:italic;font-size:21px;color:var(--terre);border:none;background:transparent;padding:0" title="Nom de la création">' +
          '<span style="flex-shrink:0;font-family:var(--font-micro);font-size:10px;font-weight:700;letter-spacing:0.04em;padding:5px 13px;border-radius:999px;background:' + col + '1f;color:' + col + '">' + esc(crStatusLabel(c.status)) + '</span>' +
        '</div>' +
        '<div class="row" style="gap:10px">' +
          '<select class="inp" onchange="ADM.crSet(\'' + pid + '\',\'' + c.id + '\',\'type\',this.value)" style="flex:1" title="Catégorie">' + crOpts(CR_TYPES, c.type) + '</select>' +
          '<select class="inp" onchange="ADM.crSet(\'' + pid + '\',\'' + c.id + '\',\'status\',this.value)" style="flex:1" title="Statut">' + crOpts(CR_STATUSES, c.status) + '</select>' +
        '</div>' +
        '<div style="border-top:1px solid var(--bone-d);padding-top:16px;display:flex;flex-direction:column;gap:9px"><div class="micro" style="color:var(--muted);letter-spacing:0.08em">Versions</div>' + vHtml + '</div>' +
        '<div class="row" style="gap:8px">' +
          '<button class="btn btn--dark btn--sm" onclick="ADM.crAddVersion(\'' + pid + '\',\'' + c.id + '\')">+ Version</button>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.crAddVersionLink(\'' + pid + '\',\'' + c.id + '\')">🔗 Lien</button>' +
          '<button class="btn btn--outline btn--sm" style="margin-left:auto;color:var(--red)" onclick="ADM.crDel(\'' + pid + '\',\'' + c.id + '\')" title="Supprimer la création">🗑</button>' +
        '</div>' +
      '</div>';
    }
    var addCard = '<div style="border:1.5px dashed var(--bone-d);border-radius:14px;background:#faf7f0;padding:20px;display:flex;flex-direction:column;gap:11px;justify-content:center;min-height:150px">' +
      '<div class="micro" style="color:var(--muted)">Nouvelle création</div>' +
      '<input class="inp" id="cr-new-' + pid + '" placeholder="ex. Flyer, Carte de visite…" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.crAdd(\'' + pid + '\');}">' +
      '<button class="btn btn--dark btn--sm" onclick="ADM.crAdd(\'' + pid + '\')">+ Créer</button>' +
    '</div>';
    var grid = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:20px">' + creations.map(card).join('') + addCard + '</div>';
    var unclassed = livr.filter(function (l) { return !l.creationId; });
    var unclassedHtml = unclassed.length ? '<div class="card" style="background:#faf7f0;margin-top:16px"><div class="micro mb">Versions non classées (dépôts d\'avant les créations)</div>' + unclassed.map(verRow).join('') + '</div>' : '';
    return '<div class="card infocard" style="background:var(--card)"><h3><span class="infocard__dot" style="background:#35608f"></span>Créations</h3>' +
      '<div class="micro mb">Chaque création (flyer, carte, brochure…) a sa catégorie, son statut et ses versions. Dépose une version par fichier ou par lien — la cliente la retrouve dans son espace pour la valider ou demander une révision.</div>' +
      grid + unclassedHtml + '</div>';
  }
  function supportsCard() {
    var rows = (CUR.supports || []).map(function (s) {
      var nm = (s.content && s.content.name) || '';
      var nCr = (s.content && Array.isArray(s.content.creations)) ? s.content.creations.length : 0;
      return '<div class="file" style="gap:10px"><input class="inp" value="' + esc(nm) + '" placeholder="' + esc(s.label) + '" onchange="ADM.renameSupport(\'' + s.pid + '\',this.value)" style="flex:1" title="Nom du projet de com">' +
        '<span class="micro" style="color:var(--muted);white-space:nowrap">' + nCr + ' création' + (nCr > 1 ? 's' : '') + '</span>' +
        '<button class="btn btn--dark btn--sm" onclick="ADM.tab(\'' + s.id + '\')">Ouvrir</button>' +
        '<button class="btn btn--danger btn--sm" onclick="ADM.delSupport(\'' + s.pid + '\')">Suppr.</button></div>';
    }).join('');
    return '<div class="card infocard" style="background:var(--card)"><h3><span class="infocard__dot" style="background:#35608f"></span>Mes créations (supports de com)</h3>' +
      '<div class="micro mb">Chaque projet de com regroupe une ou plusieurs <b>créations</b>. Crée le projet ici, puis clique <b>Ouvrir</b> pour gérer ses créations et leurs versions dans l\'onglet dédié.</div>' +
      (rows || '<div class="empty">Aucun projet de com pour ce client.</div>') +
      '<div class="row mt"><input class="inp" id="new-support-name" placeholder="Nom du projet de com (ex. Lancement printemps)" style="flex:1"><button class="btn btn--dark btn--sm" onclick="ADM.addSupport()">+ Nouveau projet</button></div></div>';
  }
  function renameSupport(pid, name) { jpost('/api/clients/' + CURKEY + '/support/' + pid, { name: name }, 'PATCH').then(function (r) { if (r.ok) { toast('Nom enregistré'); loadClient(); } else toast('Erreur'); }); }
  function addSupport() { var name = (el('new-support-name').value || '').trim(); jpost('/api/clients/' + CURKEY + '/supports', { name: name }).then(function (r) { if (r.ok) { toast('Support ajouté'); loadClient(); } else toast('Erreur'); }); }
  // Ajout rapide d'un support de com depuis la carte « Offres / espaces ».
  function addSupportQuick() { jpost('/api/clients/' + CURKEY + '/supports', { name: 'Support de com' }).then(function (r) { if (r.ok) { toast('Support de com ajouté ✓ — coche « visible » quand la cliente a signé'); loadClient(); } else toast('Erreur'); }).catch(function () { toast('Erreur'); }); }
  function delSupport(pid) {
    admConfirm({ title: 'Supprimer ce projet de com ?', message: 'Le projet et tout son contenu (créations, versions, messages) seront supprimés.', yes: 'Oui, supprimer', no: 'Non', danger: true }, function () {
      api('/api/clients/' + CURKEY + '/support/' + pid, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Projet supprimé'); refreshClient(); } else toast('Erreur'); });
    });
  }
  // ── Créations d'un projet de com (« Mes créations ») ──
  function crAdd(pid) {
    var v = (el('cr-new-' + pid) ? el('cr-new-' + pid).value : '').trim();
    jpost('/api/clients/' + CURKEY + '/support/' + pid + '/creations', { name: v }).then(function (r) { if (r.ok) { toast('Création ajoutée'); refreshClient(); } else toast('Erreur'); }).catch(function () { toast('Erreur'); });
  }
  function crSet(pid, cid, field, val) {
    var body = {}; body[field] = val;
    jpost('/api/clients/' + CURKEY + '/support/' + pid + '/creations/' + cid, body, 'PATCH').then(function (r) { if (r.ok) { refreshClient(); } else toast('Erreur'); }).catch(function () { toast('Erreur'); });
  }
  function crDel(pid, cid) {
    admConfirm({ title: 'Supprimer cette création ?', message: 'Les versions rattachées redeviennent « non classées » (non supprimées).', danger: true, yes: 'Oui, supprimer', no: 'Non' }, function () {
      api('/api/clients/' + CURKEY + '/support/' + pid + '/creations/' + cid, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Création supprimée'); refreshClient(); } else toast('Erreur'); }).catch(function () { toast('Erreur'); });
    });
  }
  function crAddVersion(pid, cid) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(inp);
    var cleanup = function () { if (inp.parentNode) inp.parentNode.removeChild(inp); };
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; if (!f) { cleanup(); return; }
      if (admTooBig(f)) { cleanup(); toast(admBigMsg(f)); return; }
      notifyConfirm('Envoyer cette version à la cliente et la prévenir par e-mail ?', function (notify) {
        var fd = new FormData(); fd.append('file', f); fd.append('projectId', 'support-' + pid); fd.append('deliverable', '1'); fd.append('creationId', cid); fd.append('notify', notify ? 'true' : 'false');
        toast('Envoi de la version…');
        api('/api/clients/' + CURKEY + '/files', { method: 'POST', body: fd }).then(admUploadResult)
          .then(function (res) { cleanup(); if (res.ok) { toast('Version envoyée' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')); refreshClient(); } else toast(admUploadErrMsg(res.status, res.d && res.d.error)); })
          .catch(function () { cleanup(); toast('Erreur — version non envoyée, réessaie'); });
      });
    };
    inp.click();
  }
  function crAddVersionLink(pid, cid) {
    var ov = document.createElement('div'); ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box"><div class="admconfirm__title">Version sous forme de lien</div>' +
      '<div class="admconfirm__msg">Colle le lien de la version (Figma, Drive, proofing…). La cliente pourra l\'ouvrir puis valider ou demander une révision.</div>' +
      '<input id="cr-dl-name" class="inp" style="width:100%;margin:6px 0" placeholder="Nom (optionnel)">' +
      '<input id="cr-dl-url" class="inp" style="width:100%;margin:0 0 6px" placeholder="https://…">' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button><button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Envoyer à la cliente</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var url = (el('cr-dl-url').value || '').trim(); if (!url) { toast('Colle un lien'); return; }
      var name = (el('cr-dl-name').value || '').trim();
      close();
      notifyConfirm('Prévenir la cliente par e-mail de cette nouvelle version ?', function (notify) {
        jpost('/api/clients/' + CURKEY + '/deliverables', { projectId: 'support-' + pid, creationId: cid, link: url, name: name, notify: notify }).then(admUploadResult)
          .then(function (res) { if (res.ok) { toast('Version envoyée' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')); refreshClient(); } else toast(admUploadErrMsg(res.status, res.d && res.d.error)); })
          .catch(function () { toast('Erreur — version non envoyée, réessaie'); });
      });
    };
    document.body.appendChild(ov);
    var i = el('cr-dl-url'); if (i) i.focus();
  }
  function crDelVersion(pid, id) {
    admConfirm({ title: 'Retirer cette version ?', message: 'La version sera retirée de l\'espace de la cliente.', danger: true, yes: 'Oui, retirer', no: 'Non' }, function () {
      api('/api/clients/' + CURKEY + '/deliverables/' + id, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: 'support-' + pid }) }).then(function (r) { if (r.ok) { toast('Version retirée'); refreshClient(); } else toast('Erreur'); }).catch(function () { toast('Erreur'); });
    });
  }
  function offersCard() {
    var offers = [];
    CUR.domains.forEach(function (dn) { offers.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label, dn.isActive !== false, (dn.content && dn.content.bannerColor) || '', !!(dn.content && dn.content.maintenance)]); });
    CUR.supports.forEach(function (s) { offers.push([s.id, s.label, s.isActive !== false, (s.content && s.content.bannerColor) || '', !!(s.content && s.content.maintenance)]); });
    var rows = offers.length ? offers.map(function (o) {
      var cur = (o[3] || '').toLowerCase();
      var swatches = DA_BANNER.map(function (c) {
        var on = cur === c[0].toLowerCase();
        return '<button onclick="ADM.setBanner(\'' + o[0] + '\',\'' + c[0] + '\')" title="' + c[1] + '" style="width:22px;height:22px;border-radius:6px;cursor:pointer;background:' + c[0] + ';border:' + (on ? '2px solid var(--terre,#412F21)' : '1px solid var(--bone-d)') + ';box-shadow:' + (on ? '0 0 0 2px #fff inset' : 'none') + '"></button>';
      }).join('');
      return '<div class="file" style="flex-wrap:wrap;gap:10px"><span class="nm">' + esc(o[1]) + ' ' + (o[2] ? '<span class="pill pill--done">active</span>' : '<span class="pill">inactive</span>') + (o[4] ? ' <span class="pill pill--a_valider">en préparation</span>' : '') + '</span>' +
        '<label class="checkbox"><input type="checkbox"' + (o[2] ? ' checked' : '') + ' onchange="ADM.toggleOffer(\'' + o[0] + '\',this.checked)"> visible</label>' +
        '<label class="checkbox"><input type="checkbox"' + (o[4] ? ' checked' : '') + ' onchange="ADM.setMaintenance(\'' + o[0] + '\',this.checked)"> en préparation</label>' +
        '<span class="row" style="gap:5px;align-items:center;flex-wrap:wrap"><span class="micro">Bannière</span>' + swatches +
          '<input type="color" value="' + (o[3] || '#8a6f54') + '" onchange="ADM.setBanner(\'' + o[0] + '\',this.value)" style="width:30px;height:22px;border:1px solid var(--bone-d);border-radius:6px;padding:1px;cursor:pointer" title="Couleur personnalisée">' +
          (o[3] ? '<button class="btn btn--outline btn--sm" onclick="ADM.setBanner(\'' + o[0] + '\',\'\')">Auto</button>' : '') +
        '</span></div>';
    }).join('') : '<div class="empty">Aucune offre pour ce client. Ajoutez-en une ci-dessous.</div>';
    // Ajouter une offre à un client existant (les types pas encore créés).
    var present = {};
    CUR.domains.forEach(function (dn) { present[dn.id] = true; });
    var addable = [['partner', 'Partenaire créative'], ['website', 'Site web'], ['branding', 'Identité visuelle'], ['maintenance', 'Maintenance site']]
      .filter(function (a) { return !present[a[0]]; });
    var addBtns = addable.map(function (a) { return '<button class="btn btn--outline btn--sm" onclick="ADM.addOffer(\'' + a[0] + '\')">+ ' + a[1] + '</button>'; }).join('');
    // « Support de com » : offre à part (on peut en avoir plusieurs), ajoutée
    // ici pour qu'elle soit cochable comme les autres, puis renommable.
    addBtns += '<button class="btn btn--outline btn--sm" onclick="ADM.addSupportQuick()">+ Support de com</button>';
    var addSection = '<div class="mt" style="border-top:1px solid var(--bone-d);padding-top:12px">' +
      '<div class="micro mb">Ajouter une offre</div>' +
      '<div class="row" style="gap:8px;flex-wrap:wrap">' + addBtns + '</div>' +
      '<div class="micro" style="color:var(--muted);margin-top:7px">Un « support de com » est un projet de support (réseaux sociaux, flyer, brochure…). Tu peux en ajouter plusieurs ; renomme-les ensuite dans la carte « Supports de com ».</div>' +
      '</div>';
    return '<div class="card infocard" style="background:var(--card)"><h3><span class="infocard__dot" style="background:#9c6f18"></span>Offres / espaces</h3>' +
      '<div class="micro mb">Activez une offre quand le client a signé : elle devient visible dans son espace. « En préparation » indique au client que l\'offre est active mais en cours de mise en place. La couleur de bannière personnalise la card côté client.</div>' + rows + addSection + '</div>';
  }
  function addOffer(type) {
    jpost('/api/clients/' + CURKEY + '/offers', { type: type }).then(function (r) {
      if (r.ok) { toast('Offre ajoutée ✓ — activez-la quand le client a signé'); loadClient(); }
      else r.json().then(function (d) { toast(d.error || 'Erreur'); }).catch(function () { toast('Erreur'); });
    }).catch(function () { toast('Erreur'); });
  }
  function setBanner(pid, color) {
    jpost('/api/clients/' + CURKEY + '/banner', { projectId: pid, color: color }, 'PATCH').then(function (r) { if (r.ok) { toast(color ? 'Couleur de bannière mise à jour' : 'Bannière en couleur automatique'); loadClient(); } else toast('Erreur'); });
  }
  function setMaintenance(pid, on) {
    jpost('/api/clients/' + CURKEY + '/maintenance', { projectId: pid, maintenance: on }, 'PATCH').then(function (r) { if (r.ok) { toast(on ? 'Marqué en préparation' : 'Préparation terminée'); loadClient(); } else toast('Erreur'); });
  }
  function toggleOffer(pid, on) {
    jpost('/api/clients/' + CURKEY + '/offer', { projectId: pid, isActive: on }, 'PATCH').then(function (r) {
      if (r.ok) { toast(on ? 'Offre activée' : 'Offre désactivée'); loadClient(); } else toast('Erreur');
    });
  }
  function toggleTicketsSpace(on) {
    jpost('/api/clients/' + CURKEY + '/tickets-space', { enabled: on }, 'PATCH').then(function (r) {
      if (r.ok) { toast(on ? 'Espace tickets activé' : 'Espace tickets désactivé'); loadClient(); } else toast('Erreur');
    });
  }
  function ticketUpdate(id, patch, okMsg) {
    var d = findDomain('maintenance'); if (!d) return;
    jpost('/api/clients/' + CURKEY + '/tickets/' + id, Object.assign({ projectId: 'maintenance' }, patch), 'PATCH').then(function (r) {
      return r.ok ? r.json() : Promise.reject();
    }).then(function (tk) {
      if (Array.isArray(d.content.tickets)) { var i = d.content.tickets.findIndex(function (t) { return t.id === id; }); if (i !== -1) d.content.tickets[i] = tk; }
      if (okMsg) toast(okMsg); renderClient();
    }).catch(function () { toast('Erreur'); });
  }
  function ticketForfait(hours) {
    var d = findDomain('maintenance'); if (!d) return;
    var n = Math.max(0, parseFloat(hours) || 0);
    jpost('/api/clients/' + CURKEY + '/forfait', { projectId: 'maintenance', monthlyHours: n }, 'PATCH').then(function (r) {
      if (r.ok) { d.content.monthlyHours = n; toast('Forfait enregistré ✓'); renderClient(); } else toast('Erreur');
    });
  }
  function ticketStatus(id, status) {
    if (status === 'done' || status === 'in_progress') {
      var msg = status === 'done'
        ? 'Prévenir la cliente par e-mail que sa demande est résolue ?'
        : 'Prévenir la cliente par e-mail que tu as commencé à travailler sur sa demande ?';
      notifyConfirm(msg, function (notify) {
        ticketUpdate(id, { status: status, notify: notify }, (status === 'done' ? 'Ticket marqué comme fait' : 'Ticket en cours') + (notify ? ' · cliente prévenue ✓' : ''));
      });
      return;
    }
    ticketUpdate(id, { status: status }, 'Statut mis à jour');
  }
  function ticketProposeDate(id, date) {
    if (!date) { ticketUpdate(id, { proposedDueDate: '' }, 'Proposition annulée'); return; }
    notifyConfirm('Proposer cette date à la cliente et la prévenir par e-mail ?', function (notify) {
      ticketUpdate(id, { proposedDueDate: date, notify: notify }, 'Report proposé' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)'));
    });
  }
  function ticketDue(id, date) { ticketUpdate(id, { dueDate: date || null }); }
  function ticketTime(id, mins) { var n = Math.max(0, parseInt(mins, 10) || 0); ticketUpdate(id, { timeSpentMinutes: n }); }
  function ticketDelete(id) {
    admConfirm({ title: 'Supprimer ce ticket ?', message: 'Il sera définitivement supprimé.', yes: 'Supprimer', no: 'Annuler', danger: true }, function () {
      var d = findDomain('maintenance');
      api('/api/clients/' + CURKEY + '/tickets/' + id + '?projectId=maintenance', { method: 'DELETE' }).then(function (r) {
        if (r.ok) { if (d && Array.isArray(d.content.tickets)) d.content.tickets = d.content.tickets.filter(function (t) { return t.id !== id; }); toast('Ticket supprimé'); renderClient(); } else toast('Erreur');
      }).catch(function () { toast('Erreur'); });
    });
  }
  function fld(id, label, val) { return '<div class="field"><label>' + esc(label) + '</label><input id="' + id + '" class="inp" value="' + esc(val || '') + '"></div>'; }
  function saveInfos() {
    var body = {
      prenom: el('inf-prenom').value, nom: el('inf-nom').value, email: el('inf-email').value, telephone: el('inf-tel').value,
      entreprise: { nom: el('inf-ent-nom').value, adresse: el('inf-ent-adr').value, siret: el('inf-ent-siret').value, tva: el('inf-ent-tva').value },
      isActive: el('inf-active').checked,
    };
    if (el('inf-visio')) body.meetingLink = el('inf-visio').value;
    jpost('/api/clients/' + CURKEY, body, 'PATCH').then(function (r) { if (r.ok) { toast('Enregistré'); loadClient(); } else toast('Erreur'); });
  }

  /* partner: forfait + tâches (sous-onglets séparés) */
  function partnerForfait(d) {
    var f = d.forfait || {};
    WORKSLOTS = (d.content && Array.isArray(d.content.workSlots)) ? d.content.workSlots.slice() : [];
    return '<div class="card"><div class="between"><h3>Forfait</h3>' +
      '<div class="row"><input id="pf-h" class="inp" type="number" style="width:90px" value="' + (f.base || 0) + '"><span class="micro">h/mois</span>' +
      '<button class="btn btn--sm" onclick="ADM.saveForfait()">OK</button></div></div>' +
      (f.configured ? '<div class="micro mt">' + (f.used || 0) + ' h consommées ce mois · reste ' + (f.remaining) + ' h</div>' : '') + '</div>' +
      '<div class="card"><h3>Créneaux réservés</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;line-height:1.6;color:var(--terre-600)">Les moments où tu travailles pour ce client. Ils s\'affichent sur son espace pour qu\'il sache quand tu es sur son projet.</div>' +
      '<div id="ws-card">' + workSlotsCard() + '</div></div>';
  }
  var WORKSLOTS = [];
  var WS_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  function wsReadInputs() {
    return WORKSLOTS.map(function (_, i) {
      return { day: (el('ws-day-' + i) || {}).value || '', from: (el('ws-from-' + i) || {}).value || '', to: (el('ws-to-' + i) || {}).value || '' };
    });
  }
  function workSlotsCard() {
    var rows = WORKSLOTS.map(function (s, i) {
      var opts = WS_DAYS.map(function (dn) { return '<option value="' + dn + '"' + (s.day === dn ? ' selected' : '') + '>' + dn + '</option>'; }).join('');
      return '<div class="row" style="gap:8px;margin-bottom:8px;flex-wrap:wrap;align-items:center">' +
        '<select class="inp" id="ws-day-' + i + '" style="width:auto">' + opts + '</select>' +
        '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">de <input class="inp" type="time" id="ws-from-' + i + '" value="' + esc(s.from || '') + '" style="width:auto"></label>' +
        '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">à <input class="inp" type="time" id="ws-to-' + i + '" value="' + esc(s.to || '') + '" style="width:auto"></label>' +
        '<button class="btn btn--danger btn--sm" style="margin-left:auto" onclick="ADM.wsDel(' + i + ')" title="Retirer">✕</button>' +
      '</div>';
    }).join('');
    return (rows || '<div class="micro" style="color:var(--muted);margin-bottom:8px">Aucun créneau défini.</div>') +
      '<div class="row mt" style="gap:8px"><button class="btn btn--outline btn--sm" onclick="ADM.wsAdd()">+ Ajouter un créneau</button>' +
      '<button class="btn btn--dark btn--sm" style="margin-left:auto" onclick="ADM.wsSave()">Enregistrer</button></div>';
  }
  function wsRepaint() { var c = el('ws-card'); if (c) c.innerHTML = workSlotsCard(); }
  function wsAdd() { WORKSLOTS = wsReadInputs(); WORKSLOTS.push({ day: 'Lundi', from: '09:00', to: '12:00' }); wsRepaint(); }
  function wsDel(i) { WORKSLOTS = wsReadInputs(); WORKSLOTS.splice(i, 1); wsRepaint(); }
  function wsSave() {
    var list = wsReadInputs().filter(function (s) { return s.day && s.from; });
    jpost('/api/clients/' + CURKEY + '/forfait', { projectId: 'partner', workSlots: list }, 'PATCH').then(function (r) { if (r.ok) { toast('Créneaux enregistrés ✓'); WORKSLOTS = list; wsRepaint(); } else toast('Erreur'); });
  }
  var TICKET_STATUS = [['open', 'À faire'], ['in_progress', 'En cours'], ['done', 'Fait']];
  function maintTickets(d) {
    var all = Array.isArray(d.content.tickets) ? d.content.tickets : [];
    var PRIO = { haute: 0, moyenne: 1, basse: 2 };
    var openT = all.filter(function (t) { return t.status !== 'done' && t.status !== 'closed'; })
      .sort(function (a, b) {
        var da = a.dueDate || '', db = b.dueDate || '';
        if (da && !db) return -1; if (!da && db) return 1; if (da !== db) return da < db ? -1 : 1;
        return (PRIO[a.priority] != null ? PRIO[a.priority] : 9) - (PRIO[b.priority] != null ? PRIO[b.priority] : 9);
      });
    var doneT = all.filter(function (t) { return t.status === 'done' || t.status === 'closed'; })
      .sort(function (a, b) { return String(b.resolvedAt || b.createdAt || '').localeCompare(String(a.resolvedAt || a.createdAt || '')); });
    var prioMap = { haute: ['Urgent', '#9b3a2e', '#fbeae5'], moyenne: ['Normal', '#8a6f2e', '#fbf0d8'], basse: ['Faible', '#3f6b3a', '#e7f0e3'] };
    function card(t) {
      var done = t.status === 'done' || t.status === 'closed';
      var opts = TICKET_STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (t.status === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('');
      var pm = prioMap[t.priority] || prioMap.moyenne;
      var prioPill = '<span style="font-family:var(--font-micro);font-size:10px;font-weight:700;letter-spacing:0.04em;color:' + pm[1] + ';background:' + pm[2] + ';padding:4px 11px;border-radius:999px">' + pm[0] + '</span>';
      var catPill = t.category ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">' + esc(t.category) + '</span>' : '';
      var dueTag = t.dueDate ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">souhaité pour ' + fmtDate(t.dueDate) + '</span>' : '';
      var newDot = t.seenByAdmin === false ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#c46a1a;margin-right:7px" title="Nouveau"></span>' : '';
      var atts = (Array.isArray(t.attachments) && t.attachments.length) ? '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:12px">' + t.attachments.map(function (a) { return '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank">📎 ' + esc(a.name || 'fichier') + '</a>'; }).join('') + '</div>' : '';
      var tkRun = TK_TIMER && TK_TIMER.id === t.id;
      var tkSec = tkRun ? (TK_TIMER.base + (Date.now() - TK_TIMER.startedAt) / 1000) : tkBase(t);
      var tkClock = '<span id="tk-timer-' + t.id + '" title="Temps passé sur ce ticket" style="font-family:var(--font-micro);font-variant-numeric:tabular-nums;font-weight:700;font-size:16px;color:' + (tkRun ? 'var(--green)' : 'var(--terre)') + ';min-width:74px;text-align:center">' + mtClock(tkSec) + '</span>';
      var tkBtn = tkRun
        ? '<button class="btn btn--outline btn--sm" style="color:var(--orange);border-color:#f0d8b0" onclick="ADM.tkPause(\'' + t.id + '\')">⏸ Pause</button>'
        : '<button class="btn btn--outline btn--sm" onclick="ADM.tkStart(\'' + t.id + '\')">▶ Démarrer</button>';
      var work = done
        ? '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:16px"><select class="inp" style="width:auto" onchange="ADM.ticketStatus(\'' + t.id + '\',this.value)">' + opts + '</select><span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">résolu' + (t.resolvedAt ? ' le ' + fmtDate(t.resolvedAt) : '') + '</span><span style="margin-left:auto;display:flex;align-items:center;gap:6px"><span class="micro" style="text-transform:none;letter-spacing:0">temps passé</span><input class="inp" type="number" min="0" style="width:70px" value="' + (t.timeSpentMinutes || 0) + '" onchange="ADM.ticketTime(\'' + t.id + '\',this.value)"><span class="micro">min</span></span></div>'
        : '<div style="background:var(--surface-2);border-radius:13px;padding:14px 16px;margin-top:16px"><div class="micro" style="margin-bottom:9px">Où en est ce ticket ?</div>' +
            '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
              '<select class="inp" style="width:auto" onchange="ADM.ticketStatus(\'' + t.id + '\',this.value)">' + opts + '</select>' +
              tkBtn +
              '<span style="margin-left:auto;display:flex;align-items:center;gap:6px">' + tkClock + '<input class="inp" type="number" min="0"' + (tkRun ? ' disabled title="Mets le chrono en pause pour saisir"' : ' title="Saisir le temps à la main (minutes)"') + ' style="width:70px" value="' + (t.timeSpentMinutes || 0) + '" onchange="ADM.ticketTime(\'' + t.id + '\',this.value)"><span class="micro">min</span></span>' +
            '</div>' +
            // Report de date : la cliente a choisi une date, Cindy peut en proposer une autre.
            '<div style="margin-top:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
              (t.dueDate ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">Souhaité pour ' + fmtDate(t.dueDate) + '</span>' : '') +
              (t.proposedDueDate
                ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:#8a6f2e;background:#fbf0d8;padding:5px 11px;border-radius:999px">⏳ Report proposé au ' + fmtDate(t.proposedDueDate) + ' — en attente</span><button class="btn btn--outline btn--sm" onclick="ADM.ticketProposeDate(\'' + t.id + '\',\'\')">Annuler</button>'
                : '<label class="micro" style="display:flex;align-items:center;gap:6px;text-transform:none;letter-spacing:0">Proposer une autre date <input class="inp" type="date" style="width:auto;padding:5px 8px"' + (t.dueDate ? ' value="' + esc(t.dueDate) + '"' : '') + ' onchange="ADM.ticketProposeDate(\'' + t.id + '\',this.value)"></label>') +
            '</div></div>';
      return '<div class="card" style="background:var(--card);padding:20px 22px' + (t.seenByAdmin === false ? ';box-shadow:var(--shadow-2)' : '') + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">' +
          '<div style="min-width:0"><div style="font-size:17px;font-weight:600;color:var(--terre);line-height:1.25">' + newDot + esc(t.title || 'Sans titre') + '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:9px">' + prioPill + catPill + dueTag + '</div></div>' +
          '<button class="btn btn--danger btn--sm" style="flex-shrink:0" onclick="ADM.ticketDelete(\'' + t.id + '\')">Suppr.</button>' +
        '</div>' +
        (t.description ? '<div style="margin-top:13px;font-size:14px;white-space:pre-wrap;line-height:1.6;color:var(--terre-600)">' + esc(t.description) + '</div>' : '') +
        atts + work +
      '</div>';
    }
    var list = openT.length
      ? '<div style="display:grid;gap:14px">' + openT.map(card).join('') + '</div>'
      : '<div class="empty">Aucun ticket en cours. La cliente ouvre ses tickets depuis son espace.</div>';
    var histBlock = doneT.length
      ? '<details style="margin-top:18px"><summary style="cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--muted);padding:6px 0">Tickets terminés · ' + doneT.length + '</summary>' +
        '<div style="display:grid;gap:14px;margin-top:12px">' + doneT.map(card).join('') + '</div></details>'
      : '';
    var mh = parseFloat(d.content.monthlyHours) || 0;
    var now = new Date(); var mk = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    var pdt = new Date(now.getFullYear(), now.getMonth() - 1, 1); var pk = pdt.getFullYear() + '-' + String(pdt.getMonth() + 1).padStart(2, '0');
    function usedMinIn(ym) { return all.reduce(function (n, t) { return n + (String(t.resolvedAt || t.createdAt || '').slice(0, 7) === ym ? (t.timeSpentMinutes || 0) : 0); }, 0); }
    function activeIn(ym) { return all.some(function (t) { return String(t.resolvedAt || t.createdAt || '').slice(0, 7) === ym; }); }
    var usedThisMonth = usedMinIn(mk);
    function fmtMin(m) { m = Math.round(m || 0); var h = Math.floor(m / 60), mm = m % 60; return h ? h + 'h' + (mm ? String(mm).padStart(2, '0') : '') : m + ' min'; }
    // Report du dépassement / des heures non utilisées, comme le forfait partenaire.
    var baseMin = mh * 60, capMin = 2 * 60;
    var carryMin = 0, billedMin = 0;
    if (baseMin && activeIn(pk)) {
      var diff = baseMin - usedMinIn(pk);
      if (diff >= 0) carryMin = Math.min(capMin, diff);
      else { var ov = -diff; var ded = Math.min(ov, baseMin); carryMin = -ded; billedMin = ov - ded; }
    }
    var availMin = baseMin + carryMin;
    var forfaitCard = '<div class="card" style="background:var(--card);padding:18px 20px;margin-bottom:16px">' +
      '<h3 style="margin:0 0 4px"><span class="infocard__dot" style="background:#9c6f18"></span>Forfait mensuel</h3>' +
      '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--muted)">Nombre d\'heures inclus chaque mois. À 0, la cliente voit un espace tickets tout simple ; au-delà, elle voit sa consommation et son suivi mensuel.</div>' +
      '<div class="row" style="align-items:center;gap:10px;flex-wrap:wrap">' +
        '<label class="micro" style="text-transform:none;letter-spacing:0;display:flex;align-items:center;gap:8px">Heures / mois <input class="inp" type="number" min="0" step="0.5" style="width:90px" value="' + mh + '" onchange="ADM.ticketForfait(this.value)"></label>' +
        (mh ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">Consommé ce mois : <strong>' + fmtMin(usedThisMonth) + '</strong> / ' + fmtMin(availMin) + (carryMin < 0 ? ' (−' + fmtMin(-carryMin) + ' du dépassement)' : (carryMin > 0 ? ' (+' + fmtMin(carryMin) + ' reportées)' : '')) + '</span>' : '') +
      '</div>' +
      (carryMin < 0 ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:#8a6f2e;margin-top:8px">' + fmtMin(-carryMin) + ' de dépassement du mois dernier déduites de ce mois' + (billedMin > 0 ? ' · ' + fmtMin(billedMin) + ' à facturer (au-delà d\'un mois de forfait)' : '') + '.</div>' : '') +
    '</div>';
    return forfaitCard +
      '<div class="card" style="background:var(--card);padding:18px 20px;margin-bottom:16px"><h3 style="margin:0 0 4px"><span class="infocard__dot" style="background:#9c6f18"></span>Tickets de la cliente</h3>' +
      '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">La cliente ouvre ses tickets depuis son espace. Fais avancer chaque ticket avec le statut « À faire · En cours · Fait» et note le temps passé. Elle est prévenue à chaque changement.</div></div>' +
      list + histBlock;
  }
  // Rendu lecture seule du contenu par blocs (brief rédigé par la cliente dans
  // son éditeur type Notion). Affiché en entier côté admin — jamais tronqué —
  // avec les tableaux visibles.
  function ptBlocksHtml(t, keyOverride, label) {
    var blocks = Array.isArray(t.blocks) ? t.blocks : [];
    if (!blocks.length) return '';
    var CK = keyOverride || CURKEY;
    var bd = '1px solid var(--bone-d)';
    var num = 0;
    var html = blocks.map(function (b) {
      if (b.type === 'numbered') num++; else num = 0;
      if (b.type === 'heading') return '<div style="font-size:17px;font-weight:700;color:var(--terre);margin:14px 0 4px">' + esc(b.text || '') + '</div>';
      if (b.type === 'subheading') return '<div style="font-size:15px;font-weight:700;color:var(--terre);margin:11px 0 3px">' + esc(b.text || '') + '</div>';
      if (b.type === 'quote') return '<div style="border-left:3px solid var(--bone-d);padding:3px 0 3px 12px;margin:8px 0;font-style:italic;color:var(--terre-600);white-space:pre-wrap">' + mtLinkify(b.text || '') + '</div>';
      if (b.type === 'callout') return '<div style="background:#F0E8FF;border-radius:10px;padding:10px 13px;margin:8px 0;color:var(--terre);white-space:pre-wrap">' + mtLinkify(b.text || '') + '</div>';
      if (b.type === 'todo') return '<div style="display:flex;gap:8px;align-items:flex-start;margin:4px 0"><span style="flex-shrink:0">' + (b.done ? '☑' : '☐') + '</span><span style="white-space:pre-wrap;' + (b.done ? 'text-decoration:line-through;color:var(--muted)' : '') + '">' + mtLinkify(b.text || '') + '</span></div>';
      if (b.type === 'list') return '<div style="display:flex;gap:8px;margin:2px 0"><span style="color:#b08968;flex-shrink:0">•</span><span style="white-space:pre-wrap">' + mtLinkify(b.text || '') + '</span></div>';
      if (b.type === 'numbered') return '<div style="display:flex;gap:8px;margin:2px 0"><span style="color:#b08968;flex-shrink:0">' + num + '.</span><span style="white-space:pre-wrap">' + mtLinkify(b.text || '') + '</span></div>';
      if (b.type === 'sep') return '<hr style="border:none;border-top:2px dashed var(--bone-d);margin:12px 0">';
      if (b.type === 'file') { var dl = b.fileKey ? ('/api/clients/' + CK + '/files/' + encodeURIComponent(b.fileKey) + '/download') : '#'; return '<div style="margin:6px 0"><a class="btn btn--outline btn--sm" href="' + dl + '" target="_blank">📎 ' + esc(b.name || 'fichier') + '</a></div>'; }
      if (b.type === 'link') { var lu = b.url || ''; return '<div style="margin:6px 0">' + (b.text ? '<strong>' + esc(b.text) + '</strong> ' : '') + (lu ? '<a href="' + esc(/^https?:\/\//i.test(lu) ? lu : 'https://' + lu) + '" target="_blank" rel="noopener" style="color:var(--glycine-900)">' + esc(lu) + '</a>' : '') + '</div>'; }
      if (b.type === 'embed') { var eu = b.url || ''; return eu ? '<div style="margin:6px 0"><a href="' + esc(eu) + '" target="_blank" rel="noopener" style="color:var(--glycine-900)">▶ ' + esc(eu) + '</a></div>' : ''; }
      if (b.type === 'table') {
        var rows = Array.isArray(b.rows) ? b.rows : [];
        if (!rows.length) return '';
        var cols = rows[0] || [];
        var head = '<tr>' + cols.map(function (c) { return '<th style="border:' + bd + ';background:var(--surface-2);padding:7px 10px;text-align:left;font-family:var(--font-micro);font-size:10px;letter-spacing:0.04em;text-transform:uppercase;color:var(--terre-600);vertical-align:top;min-width:120px">' + esc(c || '') + '</th>'; }).join('') + '</tr>';
        var body = rows.slice(1).map(function (row) { return '<tr>' + cols.map(function (_c, ci) { return '<td style="border:' + bd + ';padding:7px 10px;font-size:13px;line-height:1.5;color:var(--terre);white-space:pre-wrap;word-break:break-word;vertical-align:top;min-width:120px;max-width:420px">' + admRichSafe((row && row[ci] != null) ? row[ci] : '') + '</td>'; }).join('') + '</tr>'; }).join('');
        return '<div style="margin:10px 0;overflow-x:auto"><table style="border-collapse:collapse;width:100%">' + head + body + '</table></div>';
      }
      return '<div style="font-size:14px;line-height:1.6;color:var(--terre-600);white-space:pre-wrap;margin:6px 0">' + mtLinkify(b.text || '') + '</div>';
    }).join('');
    return '<div style="margin-top:15px"><div class="micro" style="margin-bottom:7px">' + esc(label || 'Le brief du client') + '</div>' + html + '</div>';
  }
  // Tableau « legacy » d'une tâche (t.table) — lecture seule, réutilisable
  // (fiche client ET boîte de réception).
  function briefTableHtml(table) {
    if (!table || !Array.isArray(table.cols) || !table.cols.length) return '';
    var cols = table.cols, rows = Array.isArray(table.rows) ? table.rows : [];
    var bd = '1px solid var(--bone-d)';
    var head = '<tr>' + cols.map(function (c) { return '<th style="border:' + bd + ';background:var(--surface-2);padding:8px 11px;text-align:left;font-family:var(--font-micro);font-size:10px;letter-spacing:0.04em;text-transform:uppercase;color:var(--terre-600);min-width:180px;vertical-align:top">' + esc(c) + '</th>'; }).join('') + '</tr>';
    var bodyR = rows.map(function (row) { return '<tr>' + cols.map(function (c, ci) { return '<td style="border:' + bd + ';padding:8px 11px;font-size:13px;line-height:1.5;color:var(--terre);white-space:pre-wrap;word-break:break-word;vertical-align:top;min-width:180px;max-width:460px">' + admRichSafe((row && row[ci] != null) ? row[ci] : '') + '</td>'; }).join('') + '</tr>'; }).join('');
    return '<div style="margin-top:14px"><div class="micro" style="margin-bottom:7px">Tableau du client</div><div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;max-width:100%">' + head + bodyR + '</table></div></div>';
  }
  function partnerTasks(d) {
    var raw = Array.isArray(d.content.taches) ? d.content.taches : [];
    // Les demandes en attente d'analyse vivent dans la Boîte de réception,
    // pas dans le tableau des tâches.
    var inboxN = raw.filter(function (t) { return t.stage === 'inbox' && !t.archived; }).length;
    var all = raw.filter(function (t) { return t.stage !== 'inbox'; });
    var active = all.filter(function (t) { return !t.archived; });
    var archived = all.filter(function (t) { return t.archived; });
    var inboxBanner = inboxN ? '<div class="card" style="background:#fbf5e6;border-color:#f0e2b0;max-width:760px;margin-bottom:14px"><div class="between"><span class="micro" style="text-transform:none;letter-spacing:0;color:#8a6f2e;font-weight:600">📨 ' + inboxN + ' demande' + (inboxN > 1 ? 's' : '') + ' en attente d\'analyse</span><button class="btn btn--outline btn--sm" onclick="ADM.nav(\'inbox\')">Ouvrir la boîte de réception</button></div></div>' : '';
    function ptCard(t) {
      var opts = TASK_STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (t.status === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('');
      var prun = PT_TIMER && PT_TIMER.id === t.id;
      var pbase = ptBase(t);
      var ptColor = prun ? 'var(--green)' : (pbase ? 'var(--terre)' : '#c3b9a6');
      var chrono = '<span id="pt-timer-' + t.id + '" title="Temps passé" style="font-family:var(--font-micro);font-variant-numeric:tabular-nums;font-weight:700;font-size:16px;letter-spacing:0.02em;color:' + ptColor + ';min-width:74px;text-align:center">' + mtClock(pbase) + '</span>';
      var chBtn = prun
        ? '<button class="btn btn--outline btn--sm" style="color:var(--orange);border-color:#f0d8b0" onclick="ADM.ptPause(\'' + t.id + '\')">⏸ Pause</button>'
        : '<button class="btn btn--outline btn--sm" onclick="ADM.ptStart(\'' + t.id + '\')">▶ Démarrer</button>';
      var stCol = { todo: '#a98bd6', in_progress: '#35608f', review: '#c9952f', done: '#5d7a52' }[t.status] || '#a98bd6';
      var stLbl = { todo: 'À faire', in_progress: 'En cours', review: 'À valider', done: 'Terminé' }[t.status] || t.status;
      var stBg = { todo: '#efe6fb', in_progress: '#e3edfb', review: '#fbf0d8', done: '#e7f0e3' }[t.status] || '#efe6fb';
      var needsAction = t.status === 'review';
      var archBtn = t.archived
        ? '<button class="btn btn--outline btn--sm" onclick="ADM.taskArchive(\'' + t.id + '\',false)">Restaurer</button>'
        : (t.status === 'done' ? '<button class="btn btn--outline btn--sm" onclick="ADM.taskArchive(\'' + t.id + '\',true)">Archiver</button>' : '');
      var hair = 'height:1px;background:var(--bone-d);margin:18px 0;opacity:0.7';
      var pill = '<span style="display:inline-block;font-family:var(--font-micro);font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:' + stCol + ';background:' + stBg + ';padding:4px 11px;border-radius:999px">' + stLbl + '</span>';
      var dueTag = t.dueDate ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">échéance ' + fmtDate(t.dueDate) + '</span>' : '';
      // en-tête : titre + statut/échéance à gauche, actions à droite
      // Badge « livrable » : catégorise la tâche selon l'état de son dernier
      // livrable envoyé (envoyé/à valider, validé, révision demandée).
      var tls = (d.content.livrables || []).filter(function (l) { return l.taskId === t.id; }).slice()
        .sort(function (a, b) { return String(a.createdAt || '').localeCompare(String(b.createdAt || '')); });
      var lastDlv = tls[tls.length - 1];
      var dlvBadge = '';
      if (lastDlv) {
        var dm = {
          a_valider: ['📦 Livrable envoyé' + (lastDlv.createdAt ? ' le ' + fmtDate(lastDlv.createdAt) : '') + ' · en attente de validation', '#8a6f2e', '#fbf0d8'],
          valide: ['📦 Livrable validé' + (lastDlv.validatedAt ? ' le ' + fmtDate(lastDlv.validatedAt) : '') + ' ✓', '#3f6b3a', '#e7f0e3'],
          refuse: ['📦 Révision demandée', '#9b3a2e', '#fbeae5'],
          revision: ['📦 Révision demandée', '#9b3a2e', '#fbeae5']
        }[lastDlv.status || 'a_valider'] || null;
        if (dm) dlvBadge = '<span style="font-family:var(--font-micro);font-size:10px;font-weight:700;letter-spacing:0.03em;color:' + dm[1] + ';background:' + dm[2] + ';padding:4px 11px;border-radius:999px">' + dm[0] + (tls.length > 1 ? ' · V' + tls.length : '') + '</span>';
      }
      var header = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">' +
        '<div style="min-width:0">' +
          '<div style="font-size:18px;font-weight:600;color:var(--terre);line-height:1.25">' + esc(t.title) + '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:9px">' + pill + dueTag + dlvBadge + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:7px;flex-shrink:0">' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.taskEditOpen(\'' + t.id + '\')">Modifier</button>' + archBtn +
          '<button class="btn btn--danger btn--sm" onclick="ADM.taskDelete(\'' + t.id + '\')">Suppr.</button>' +
        '</div></div>';
      // brief de la demande
      var brief = t.content ? (function () {
        var long = t.content.length > 260 || (t.content.match(/\n/g) || []).length > 4;
        return '<div style="margin-top:15px"><div class="micro" style="margin-bottom:7px">La demande du client</div>' +
          '<div id="ptc-' + t.id + '" style="font-size:14px;white-space:pre-wrap;line-height:1.6;color:var(--terre-600)' + (long ? ';display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden' : '') + '">' + mtLinkify(t.content) + '</div>' +
          (long ? '<button id="ptc-btn-' + t.id + '" onclick="ADM.ptToggleContent(\'' + t.id + '\')" style="background:none;border:none;color:var(--glycine-900);font-size:12px;cursor:pointer;padding:6px 0 0;text-decoration:underline">Tout afficher</button>' : '') + '</div>';
      })() : '';
      var atts = (Array.isArray(t.attachments) && t.attachments.length) ? '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:12px">' + t.attachments.map(function (a) { return '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank">📎 ' + esc(a.name || 'fichier') + '</a>'; }).join('') + '</div>' : '';
      // Lien & fichiers ajoutés par le client dans sa tâche (propriété p_elements).
      var be = ptBriefElements(t);
      var beHtml = (be.link || be.files.length) ? '<div style="margin-top:14px"><div class="micro" style="margin-bottom:7px">Lien & fichiers du client</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:7px">' +
        (be.link ? '<a class="btn btn--outline btn--sm" href="' + esc(/^https?:\/\//i.test(be.link) ? be.link : 'https://' + be.link) + '" target="_blank" rel="noopener">🔗 ' + esc(be.link.replace(/^https?:\/\//i, '').slice(0, 60)) + '</a>' : '') +
        be.files.map(function (f) { return '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">📎 ' + esc(f.name || 'fichier') + '</a>'; }).join('') +
        '</div></div>' : '';
      // Tableau rempli par le client (lecture seule côté admin).
      var tableHtml = briefTableHtml(t.table);
      // bloc « suivi » : statut + chrono, dans un encart doux
      var work = '<div style="background:var(--surface-2);border-radius:13px;padding:14px 16px;margin-top:16px">' +
        '<div class="micro" style="margin-bottom:9px">Où en est cette tâche ?</div>' +
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<select class="inp" style="width:auto" onchange="ADM.taskStatus(\'' + t.id + '\',this.value)">' + opts + '</select>' +
          chBtn +
          '<span style="margin-left:auto;display:flex;align-items:center;gap:6px"><span class="micro" style="text-transform:none;letter-spacing:0">temps</span>' + chrono +
            '<input class="inp" type="number" min="0" step="15" value="' + (t.timeSpentMinutes || 0) + '"' + (prun ? ' disabled title="Mets le chrono en pause pour saisir"' : ' title="Saisir le temps passé (minutes)"') + ' style="width:78px" onchange="ADM.taskTime(\'' + t.id + '\',this.value)"><span class="micro" style="text-transform:none;letter-spacing:0">min</span></span>' +
        '</div>' +
        // Report d'échéance : proposé à la cliente, qui doit l'accepter.
        '<div style="margin-top:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          (t.proposedDueDate
            ? '<span class="micro" style="text-transform:none;letter-spacing:0;color:#8a6f2e;background:#fbf0d8;padding:5px 11px;border-radius:999px">⏳ Report proposé au ' + fmtDate(t.proposedDueDate) + ' — en attente de la cliente</span>' +
              '<button class="btn btn--outline btn--sm" onclick="ADM.taskProposeDate(\'' + t.id + '\',\'\')">Annuler la proposition</button>'
            : '<span class="micro" style="text-transform:none;letter-spacing:0">Proposer un report d\'échéance</span><input class="inp" type="date" style="width:auto;padding:5px 8px"' + (t.dueDate ? ' value="' + esc(t.dueDate) + '"' : '') + ' onchange="ADM.taskProposeDate(\'' + t.id + '\',this.value)"><span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">la cliente devra l\'accepter</span>') +
        '</div></div>';
      // Lien de révision : l'endroit pour déposer un lien (Figma, proofing, Drive…)
      // que le client doit vérifier. « Envoyer au client » passe la tâche en
      // « À valider » et prévient le client par mail.
      var histArr = Array.isArray(t.reviewHistory) ? t.reviewHistory.slice().reverse() : [];
      var histHtml = histArr.length
        ? '<div style="margin-top:12px"><div class="micro" style="margin-bottom:4px">Historique des révisions · ' + histArr.length + '</div>' +
          histArr.map(function (h, i) {
            return '<div style="display:flex;gap:9px;align-items:baseline;font-size:12.5px;padding:6px 0;border-top:1px solid var(--bone-d)">' +
              '<span class="micro" style="color:var(--terre);text-transform:none;letter-spacing:0;flex-shrink:0">R' + (histArr.length - i) + '</span>' +
              '<a href="' + esc(h.url) + '" target="_blank" rel="noopener" style="color:var(--glycine-900);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(h.url) + '</a>' +
              '<span class="micro" style="color:var(--muted);text-transform:none;letter-spacing:0;flex-shrink:0">' + fmtDate(h.at) + '</span></div>';
          }).join('') + '</div>'
        : (t.reviewLink
          ? '<div style="margin-top:9px;font-size:12.5px"><a href="' + esc(t.reviewLink) + '" target="_blank" rel="noopener" style="color:var(--glycine-900)">' + esc(t.reviewLink) + '</a> <span class="micro" style="color:var(--muted);text-transform:none;letter-spacing:0">— enregistré, pas encore envoyé</span></div>'
          : '');
      var reviewSaved = histHtml;
      var review = '<div style="background:#faf6ee;border:1px solid var(--bone-d);border-radius:13px;padding:14px 16px;margin-top:14px">' +
        '<div class="micro" style="margin-bottom:9px">Lien de révision à faire vérifier par le client</div>' +
        '<div class="row" style="gap:8px;flex-wrap:wrap">' +
          '<input id="trl-' + t.id + '" class="inp" style="flex:1;min-width:180px" placeholder="https://… (Figma, proofing, Drive…)" value="' + esc(t.reviewLink || '') + '">' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.taskReview(\'' + t.id + '\')">Enregistrer</button>' +
          '<button class="btn btn--dark btn--sm" onclick="ADM.taskSendReview(\'' + t.id + '\')">Envoyer au client</button>' +
        '</div>' + reviewSaved +
        '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:8px">« Envoyer au client » passe l\'avancement en « À valider » et prévient le client par e-mail qu\'il doit vérifier ce lien.</div>' +
        '</div>';
      // Bandeau « retours reçus » : marqué directement sur la fiche tant que
      // Cindy ne l'a pas traité (elle peut le lever ici, ou en renvoyant/terminant).
      var reworkBanner = t.needsRework ? '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#eef4ea;border:1px solid #cfe0c6;border-radius:12px;padding:12px 15px;margin-bottom:16px">' +
        '<span style="font-size:18px">↩</span>' +
        '<div style="flex:1;min-width:0"><div style="font-weight:700;color:#3f5a37;font-size:14px">Le client a fait ses retours</div>' +
        '<div class="micro" style="text-transform:none;letter-spacing:0;color:#5a7050">C\'est à toi de retravailler la tâche' + (t.clientFeedbackAt ? ' · reçu le ' + fmtDate(t.clientFeedbackAt) : '') + '.</div></div>' +
        '<button class="btn btn--outline btn--sm" onclick="ADM.taskClearRework(\'' + t.id + '\')">Marquer traité</button>' +
        '</div>' : '';
      // Contenu du brief : on affiche l'éditeur par blocs (complet) s'il existe,
      // sinon l'ancien champ texte. Plus jamais tronqué côté admin.
      var contentHtml = (Array.isArray(t.blocks) && t.blocks.length) ? ptBlocksHtml(t) : brief;
      return '<div class="card" style="background:var(--card);padding:22px 24px' + (needsAction || t.needsRework || t.clientCommentNotif ? ';box-shadow:var(--shadow-2)' : '') + '">' +
        reworkBanner + header + contentHtml + atts + beHtml + tableHtml + work + review +
        '<div style="' + hair + '"></div>' +
        taskDlvBlock(d, t) +
        '<div style="' + hair + '"></div>' +
        commentsBlock('partner', t) +
        '<div style="' + hair + '"></div>' +
        '<details><summary style="cursor:pointer;font-family:var(--font-micro);font-size:10px;letter-spacing:0.07em;text-transform:uppercase;color:var(--muted);padding:2px 0">Plus d\'options</summary>' +
          '<div class="row mt" style="align-items:center;gap:10px"><span class="micro">Temps passé</span><input class="inp" type="number" style="width:80px" value="' + (t.timeSpentMinutes || 0) + '" title="ajuster les minutes" onchange="ADM.taskTime(\'' + t.id + '\',this.value)"><span class="micro">min</span></div>' +
          sessionsBlock(t) +
          '<div class="row mt" style="align-items:center;gap:12px;flex-wrap:wrap">' +
            '<span class="micro">Jalons proposés</span>' +
            '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">V1 <input class="inp" type="date" style="width:auto;padding:5px 8px" value="' + esc(t.v1Date || '') + '" onchange="ADM.taskMilestone(\'' + t.id + '\',\'v1Date\',this.value)"></label>' +
            '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">V2 <input class="inp" type="date" style="width:auto;padding:5px 8px" value="' + esc(t.v2Date || '') + '" onchange="ADM.taskMilestone(\'' + t.id + '\',\'v2Date\',this.value)"></label>' +
          '</div>' +
        '</details>' +
        '</div>';
    }
    var grid = active.length ? '<div style="display:flex;flex-direction:column;gap:16px;max-width:760px">' + active.map(ptCard).join('') + '</div>' : '<div class="empty">Aucune tâche (le client les crée depuis son espace).</div>';
    var archHtml = archived.length ? '<details style="margin-top:18px"><summary style="cursor:pointer;font-family:var(--font-micro);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);padding:6px 0">Tâches archivées · ' + archived.length + '</summary><div style="display:flex;flex-direction:column;gap:16px;max-width:760px;margin-top:12px">' + archived.map(ptCard).join('') + '</div></details>' : '';
    return inboxBanner + grid + archHtml;
  }
  // Décode la propriété composite p_elements du client (« Lien & fichiers »).
  function ptBriefElements(t) {
    var v = t && t.properties && t.properties.p_elements;
    if (!v) return { link: '', files: [] };
    try { var o = typeof v === 'string' ? JSON.parse(v) : v; return { link: (o && o.link) || '', files: (o && Array.isArray(o.files)) ? o.files : [] }; }
    catch (e) { return { link: '', files: [] }; }
  }
  function ptToggleContent(id) {
    var c = el('ptc-' + id), b = el('ptc-btn-' + id); if (!c || !b) return;
    var clamped = c.style.webkitLineClamp !== '';
    if (clamped) { c.style.display = 'block'; c.style.webkitLineClamp = ''; c.style.webkitBoxOrient = ''; c.style.overflow = 'visible'; b.textContent = 'Réduire'; }
    else { c.style.display = '-webkit-box'; c.style.webkitLineClamp = '5'; c.style.webkitBoxOrient = 'vertical'; c.style.overflow = 'hidden'; b.textContent = 'Tout afficher'; }
  }
  function taskClearRework(id) { jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', needsRework: false }, 'PATCH').then(function (r) { if (r.ok) { toast('Retours marqués comme traités'); loadClient(); } else toast('Erreur'); }); }
  function taskArchive(id, val) { if (val && PT_TIMER && PT_TIMER.id === id) ptPause(id, true); jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', archived: !!val }, 'PATCH').then(function (r) { if (r.ok) { toast(val ? 'Tâche archivée' : 'Tâche restaurée'); loadClient(); } else toast('Erreur'); }); }
  function taskMilestone(id, field, val) { var body = { projectId: 'partner' }; body[field] = val || null; jpost('/api/clients/' + CURKEY + '/tasks/' + id, body, 'PATCH').then(function (r) { if (r.ok) { toast(val ? 'Jalon enregistré' : 'Jalon retiré'); loadClient(); } else toast('Erreur'); }); }
  function taskProposeDate(id, date) {
    if (!date) { jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', proposedDueDate: '' }, 'PATCH').then(function (r) { if (r.ok) { toast('Proposition annulée'); loadClient(); } else toast('Erreur'); }); return; }
    notifyConfirm('Proposer cette date à la cliente et la prévenir par e-mail ?', function (notify) {
      jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', proposedDueDate: date, notify: notify }, 'PATCH').then(function (r) {
        if (r.ok) { toast('Report proposé' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')); loadClient(); } else toast('Erreur'); });
    });
  }
  function taskFind(id) { var found = null; (CUR.domains || []).forEach(function (dn) { ((dn.content && dn.content.taches) || []).forEach(function (x) { if (x.id === id) found = x; }); }); (CUR.supports || []).forEach(function (s) { ((s.content && s.content.taches) || []).forEach(function (x) { if (x.id === id) found = x; }); }); return found; }
  function taskEditOpen(id) {
    var t = taskFind(id); if (!t) { toast('Tâche introuvable'); return; }
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:520px">' +
      '<div class="admconfirm__title">Modifier la tâche</div>' +
      '<div class="field mt"><label>Titre</label><input id="te-title" class="inp" value="' + esc(t.title || '') + '"></div>' +
      '<div class="field mt"><label>Détail / brief</label><textarea id="te-content" class="inp" style="min-height:120px">' + esc(t.content || '') + '</textarea></div>' +
      '<div class="field mt"><label>Échéance</label><input id="te-due" class="inp" type="date" value="' + esc((t.dueDate || '').slice(0, 10)) + '"></div>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button><button class="btn btn--dark btn--sm" data-yes>Enregistrer</button></div>' +
      '</div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var body = { projectId: 'partner', title: (el('te-title').value || '').trim(), content: el('te-content').value, dueDate: el('te-due').value || null };
      if (!body.title) { toast('Titre requis'); return; }
      close();
      jpost('/api/clients/' + CURKEY + '/tasks/' + id, body, 'PATCH').then(function (r) { if (r.ok) { toast('Tâche modifiée'); loadClient(); } else toast('Erreur'); });
    };
    document.body.appendChild(ov);
    var f = el('te-title'); if (f) f.focus();
  }
  function taskDlvBlock(d, t) {
    var stLbl = { a_valider: 'à valider', valide: 'validé', refuse: 'à revoir', revision: 'à revoir' };
    var ls = (d.content.livrables || []).filter(function (l) { return l.taskId === t.id; }).slice()
      .sort(function (a, b) { return String(a.createdAt || '').localeCompare(String(b.createdAt || '')); });
    var rows = ls.map(function (l, i) {
      var isLast = i === ls.length - 1;
      return '<div class="file" style="' + (isLast ? '' : 'opacity:0.72') + '"><span class="nm">' +
        '<strong style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.04em;color:var(--terre)">V' + (i + 1) + '</strong> ' + esc(l.name) + ' ' + pill(l.status, stLbl[l.status] || l.status) +
        (l.createdAt ? ' <span class="micro" style="letter-spacing:0.02em">' + fmtDate(l.createdAt) + '</span>' : '') +
        (l.clientComment ? '<div class="muted" style="font-size:13px;font-style:italic;margin-top:2px">« ' + esc(l.clientComment) + ' »</div>' : '') + '</span>' +
        (l.fileKey ? '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(l.fileKey) + '/download">↓</a>' : '') +
        (l.reviewLink ? '<a class="btn btn--outline btn--sm" href="' + esc(/^https?:\/\//i.test(l.reviewLink) ? l.reviewLink : 'https://' + l.reviewLink) + '" target="_blank" rel="noopener">🔗 Ouvrir</a>' : '') +
        '<button class="btn btn--danger btn--sm" onclick="ADM.delDeliverable(\'' + l.id + '\')">Retirer</button></div>';
    }).join('');
    var vlabel = ls.length ? '+ Nouvelle version' : '+ Livrable';
    return '<div>' +
      '<div class="micro" style="margin-bottom:10px">Versions du livrable' + (ls.length ? ' · ' + ls.length : '') + '</div>' +
      (rows ? '<div style="display:flex;flex-direction:column;gap:8px">' + rows + '</div>' : '<div class="micro muted" style="text-transform:none;letter-spacing:0;padding:2px 0 4px">Aucun livrable déposé pour l\'instant.</div>') +
      '<div class="row" style="margin-top:12px;gap:8px;align-items:center"><span class="micro" style="text-transform:none;letter-spacing:0">Temps passé sur ce livrable</span><input class="inp" id="tdt-' + t.id + '" type="number" min="0" step="15" placeholder="min" style="width:90px"><span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">min · ajouté au temps de la tâche à l\'envoi</span></div>' +
      '<div class="row" style="margin-top:8px;gap:8px"><input class="inp" type="file" id="tdf-' + t.id + '" style="flex:1"><button class="btn btn--dark btn--sm" onclick="ADM.uploadTaskDlv(\'' + t.id + '\')">' + vlabel + ' (fichier)</button></div>' +
      '<div class="row" style="margin-top:8px;gap:8px;flex-wrap:wrap"><input class="inp" id="tdl-name-' + t.id + '" placeholder="Nom (optionnel)" style="width:150px"><input class="inp" type="url" id="tdl-url-' + t.id + '" placeholder="https://… (Figma, Drive…)" style="flex:1;min-width:160px"><button class="btn btn--outline btn--sm" onclick="ADM.addDlvLink(\'' + t.id + '\')">' + vlabel + ' (lien)</button></div>' +
      '</div>';
  }
  // Temps saisi dans le bloc livrable, ajouté au temps de la tâche à l'envoi.
  function dlvTimeFor(id) { var e = el('tdt-' + id); return e ? Math.max(0, parseInt(e.value, 10) || 0) : 0; }
  function dlvApplyTime(id, mins) {
    if (!mins) return;
    var t = (typeof taskFind === 'function') ? taskFind(id) : null;
    var curMin = t ? (t.timeSpentMinutes || Math.round((t.timeSpentSeconds || 0) / 60)) : 0;
    var total = curMin + mins;
    jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', timeSpentMinutes: total, timeSpentSeconds: total * 60, forceTime: true }, 'PATCH');
  }
  function addDlvLink(id) {
    var url = (el('tdl-url-' + id).value || '').trim();
    if (!url) { toast('Colle un lien'); return; }
    var name = (el('tdl-name-' + id).value || '').trim();
    var mins = dlvTimeFor(id);
    notifyConfirm('Envoyer ce livrable (lien) à la cliente et la prévenir par e-mail ?', function (notify) {
      jpost('/api/clients/' + CURKEY + '/deliverables', { projectId: 'partner', taskId: id, link: url, name: name, notify: notify }).then(admUploadResult)
        .then(function (res) { if (res.ok) { dlvApplyTime(id, mins); toast((mins ? 'Livrable envoyé · ' + mins + ' min ajoutées' : 'Livrable envoyé') + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')); refreshClient(); } else toast(admUploadErrMsg(res.status, res.d && res.d.error)); })
        .catch(function () { toast('Erreur — livrable non envoyé, réessaie'); });
    });
  }
  function delDeliverable(id) {
    admConfirm({ title: 'Retirer ce livrable ?', message: 'Le fichier livrable sera retiré de l\'espace du client. Cette action est définitive.', danger: true, yes: 'Oui, retirer', no: 'Non' }, function () {
      api('/api/clients/' + CURKEY + '/deliverables/' + id, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: 'partner' }) }).then(function (r) { if (r.ok) { toast('Livrable retiré'); refreshClient(); } else toast('Erreur'); }).catch(function () { toast('Erreur'); });
    });
  }
  function taskReview(id) {
    jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', reviewLink: (el('trl-' + id).value || '').trim() }, 'PATCH').then(function (r) { if (r.ok) { toast('Lien de révision enregistré'); loadClient(); } else toast('Erreur'); });
  }
  // Envoie le lien au client : enregistre, passe la tâche en « À valider »
  // (review) et déclenche l'e-mail au client (côté serveur, sur le passage en review).
  function taskSendReview(id) {
    var link = (el('trl-' + id).value || '').trim();
    if (!link) { toast('Ajoute d\'abord un lien de révision'); return; }
    notifyConfirm('Envoyer ce lien de révision à la cliente et la prévenir par e-mail ?', function (notify) {
      jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', reviewLink: link, status: 'review', logReview: true, notify: notify }, 'PATCH').then(function (r) {
        if (r.ok) { toast('Lien envoyé — tâche en « À valider »' + (notify ? ' · cliente prévenue ✓' : ' (sans e-mail)')); loadClient(); } else toast('Erreur');
      });
    });
  }
  function uploadTaskDlv(id) {
    var inp = el('tdf-' + id); var f = inp && inp.files[0]; if (!f) { toast('Choisis un fichier'); return; }
    if (admTooBig(f)) { toast(admBigMsg(f)); return; }
    var cname = (CUR && CUR.client && (CUR.client.prenom || CUR.client.nom)) || 'le client';
    var mins = dlvTimeFor(id);
    notifyConfirm('Envoyer ce livrable à la cliente et la prévenir par e-mail ?', function (notify) {
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', 'partner'); fd.append('deliverable', '1'); fd.append('taskId', id); fd.append('notify', notify ? 'true' : 'false');
      toast('Envoi du livrable…');
      api('/api/clients/' + CURKEY + '/files', { method: 'POST', body: fd }).then(admUploadResult)
        .then(function (res) { if (res.ok) { dlvApplyTime(id, mins); toast('Livrable envoyé à ' + cname + (mins ? ' · ' + mins + ' min' : '') + (notify ? ' · prévenu·e par e-mail' : ' (sans e-mail)')); refreshClient(); } else toast(admUploadErrMsg(res.status, res.d && res.d.error)); })
        .catch(function () { toast('Erreur — livrable non envoyé (fichier volumineux ? envoie-le en lien). Réessaie.'); });
    });
  }
  function commentsBlock(pid, t) {
    var list = (t.comments || []);
    var cs = list.length ? list.map(function (c) {
      var mine = c.author === 'cindy';
      var bg = mine ? 'var(--surface-2)' : '#f4f1fa';
      var who = mine ? 'Vous' : 'Client';
      return '<div style="display:flex;flex-direction:column;align-items:' + (mine ? 'flex-end' : 'flex-start') + ';margin-bottom:7px">' +
        '<div style="max-width:88%;background:' + bg + ';border-radius:12px;padding:8px 12px">' +
          '<div class="micro" style="text-transform:none;letter-spacing:0;color:' + (mine ? 'var(--muted)' : '#6c4ea4') + ';font-weight:700;margin-bottom:2px">' + who + (c.createdAt ? ' · ' + fmtDate(c.createdAt) : '') + '</div>' +
          '<div style="font-size:13.5px;color:var(--terre);line-height:1.45">' + mtLinkify(c.text || '') + '</div>' +
        '</div></div>';
    }).join('') : '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-bottom:8px">Aucun échange pour l\'instant.</div>';
    var flag = t.clientCommentNotif ? '<span style="font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#6c4ea4;background:#efe6fb;padding:3px 8px;border-radius:999px;margin-left:8px">Nouveau</span>' : '';
    return '<div><div class="micro" style="margin-bottom:9px">Échanges sur la tâche' + flag + '</div>' + cs +
      '<div class="row mt" style="gap:8px"><input class="inp" style="flex:1" id="cm-' + t.id + '" placeholder="Répondre au client…" onkeydown="if(event.key===\'Enter\')ADM.taskComment(\'' + pid + '\',\'' + t.id + '\')"><button class="btn btn--dark btn--sm" onclick="ADM.taskComment(\'' + pid + '\',\'' + t.id + '\')">Envoyer</button></div></div>';
  }
  /* bilan de fin de collaboration + suivi des bénéfices */
  function bilanStars(n) { var h = ''; for (var i = 1; i <= 5; i++) { h += '<span style="font-size:20px;color:' + ((n >= i) ? '#d8a93a' : '#d9cfbe') + '">' + ((n >= i) ? '★' : '☆') + '</span>'; } return h; }
  // ── Réponses aux questionnaires envoyés à cette cliente (lecture) ──
  function qnrFmtAnswer(a) {
    if (a == null || a === '') return '—';
    if (Array.isArray(a)) return a.length ? a.join(', ') : '—';
    if (typeof a === 'object') {
      var keys = Object.keys(a); if (!keys.length) return '—';
      return keys.map(function (k) { return k + ' : ' + a[k]; })
        .sort(function (x, y) { return (parseInt(x.split(' : ')[1], 10) || 99) - (parseInt(y.split(' : ')[1], 10) || 99); })
        .join(' · ');
    }
    return String(a);
  }
  function qnrAnswersBody(inst) {
    var ans = inst.answers || {};
    var rows = (inst.steps || []).map(function (s) {
      var blocks = (s.blocks || []).filter(function (b) { return b.type !== 'title' && b.type !== 'paragraph'; });
      if (!blocks.length) return '';
      var qs = blocks.map(function (b) {
        var disp = qnrFmtAnswer(ans[b.id]);
        return '<div style="margin-bottom:12px"><div style="font-weight:600;font-size:13.5px;color:var(--terre)">' + esc(b.label || '') + '</div>' +
          '<div style="font-size:14px;color:' + (disp === '—' ? 'var(--muted)' : 'var(--terre-600)') + ';white-space:pre-wrap;margin-top:2px">' + esc(disp) + '</div></div>';
      }).join('');
      return '<div style="margin-top:16px"><div class="micro" style="text-transform:none;letter-spacing:0.04em;color:var(--muted);margin-bottom:8px;font-weight:700">' + esc(s.title || '') + '</div>' + qs + '</div>';
    }).join('');
    return rows || '<div class="empty">Ce questionnaire ne contient pas de question.</div>';
  }
  function qnrAnswersTab() {
    var list = CUR.questionnaires || [];
    if (!list.length) return '<div class="card infocard" style="background:var(--card)"><h3>Questionnaires</h3><div class="empty">Aucun questionnaire envoyé à cette cliente. Envoie-en un depuis « Questionnaires » (menu de gauche).</div></div>';
    var stMeta = { assigned: ['À remplir', '#8a6f2e', '#fbf0d8'], in_progress: ['En cours', '#35608f', '#e3edfb'], to_review: ['À revoir', '#8a6f2e', '#fbf0d8'], completed: ['Complété ✓', '#3f6b3a', '#e7f0e3'] };
    var pending = list.filter(function (q) { return q.status !== 'completed'; }).length;
    var doneN = list.filter(function (q) { return q.status === 'completed'; }).length;
    var summary = '<div class="card infocard" style="background:var(--card);max-width:760px;padding:14px 18px"><span class="micro" style="text-transform:none;letter-spacing:0;color:var(--terre-600);font-weight:600">' +
      (pending ? '⏳ ' + pending + ' questionnaire' + (pending > 1 ? 's' : '') + ' en attente de réponse' : '✓ Tous les questionnaires sont complétés') +
      (doneN ? ' · ' + doneN + ' complété' + (doneN > 1 ? 's' : '') : '') + '</span></div>';
    var cards = list.map(function (inst) {
      var sm = stMeta[inst.status] || stMeta.assigned;
      var when = inst.completedAt ? ' · le ' + fmtDate(inst.completedAt) : '';
      var hasAns = inst.status === 'completed' || inst.status === 'to_review' || (inst.answers && Object.keys(inst.answers).length);
      var body = hasAns ? qnrAnswersBody(inst) : '<div class="empty">Pas encore de réponses — la cliente ne l\'a pas encore rempli.</div>';
      var pill = '<span style="flex-shrink:0;font-size:11.5px;font-weight:600;color:' + sm[1] + ';background:' + sm[2] + ';padding:4px 11px;border-radius:999px;white-space:nowrap">' + esc(sm[0]) + when + '</span>';
      var del = '<button class="btn btn--danger btn--sm" title="Supprimer ce questionnaire" onclick="ADM.qnrDelete(\'' + inst.id + '\',\'' + esc((inst.name || '').replace(/'/g, "\\'")) + '\')">Suppr.</button>';
      var pdf = '<button class="btn btn--outline btn--sm" title="Télécharger en PDF (via Imprimer)" onclick="ADM.qnrExportPdf(\'' + inst.id + '\')">PDF</button>';
      return '<div class="card infocard" style="background:var(--card);max-width:760px">' +
        '<div class="between" style="align-items:flex-start;gap:10px"><h3 style="margin:0">' + esc(inst.name || 'Questionnaire') + '</h3>' +
        '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">' + pill + pdf + del + '</div></div>' +
        body + '</div>';
    }).join('');
    return summary + cards;
  }
  // Export PDF d'un questionnaire (questions + réponses de la cliente) : on ouvre
  // une vue imprimable propre et on déclenche l'impression → « Enregistrer en PDF ».
  function qnrExportPdf(id) {
    var inst = (CUR.questionnaires || []).filter(function (q) { return q.id === id; })[0];
    if (!inst) { toast('Questionnaire introuvable'); return; }
    var cn = (CUR.client ? ((CUR.client.prenom || '') + ' ' + (CUR.client.nom || '')).trim() || CUR.client.email : '') || '';
    var ans = inst.answers || {};
    var when = inst.completedAt ? fmtDate(inst.completedAt) : (inst.updatedAt ? fmtDate(inst.updatedAt) : '');
    var sections = (inst.steps || []).map(function (s) {
      var inner = (s.blocks || []).map(function (b) {
        if (b.type === 'title') return '<h3 class="qt">' + esc(b.label || '') + '</h3>';
        if (b.type === 'paragraph') return '<p class="qp">' + esc(b.label || '') + '</p>';
        var disp = qnrFmtAnswer(ans[b.id]);
        return '<div class="q"><div class="ql">' + esc(b.label || '') + '</div><div class="qa' + (disp === '—' ? ' empty' : '') + '">' + esc(disp) + '</div></div>';
      }).join('');
      return '<section><div class="sh">' + esc(s.title || '') + '</div>' + inner + '</section>';
    }).join('');
    var css = 'body{font-family:Georgia,\'Times New Roman\',serif;color:#2a2018;max-width:720px;margin:0 auto;padding:40px 34px;line-height:1.5}' +
      'h1{font-size:26px;font-style:italic;margin:0 0 4px;color:#412F21}' +
      '.meta{font-size:12px;color:#8a7a63;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:26px}' +
      'section{margin-bottom:22px}' +
      '.sh{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9c7a3a;border-bottom:1px solid #e8ddc9;padding-bottom:5px;margin:22px 0 12px}' +
      '.q{margin-bottom:14px}.ql{font-weight:700;font-size:14px;color:#412F21}.qa{font-size:14px;color:#40352a;white-space:pre-wrap;margin-top:2px}' +
      '.qa.empty{color:#b3a48c;font-style:italic}.qt{font-size:17px;font-style:italic;color:#412F21;margin:18px 0 4px}.qp{font-size:13px;color:#6b5b45;margin:0 0 8px}' +
      'footer{margin-top:34px;padding-top:14px;border-top:1px solid #e8ddc9;font-size:11px;color:#9c8a70;text-align:center}' +
      '@media print{body{padding:0}@page{margin:16mm}}';
    var doc = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(inst.name || 'Questionnaire') + (cn ? ' — ' + esc(cn) : '') + '</title><style>' + css + '</style></head><body>' +
      '<h1>' + esc(inst.name || 'Questionnaire') + '</h1>' +
      '<div class="meta">' + (cn ? esc(cn) : '') + (cn && when ? ' · ' : '') + (when ? 'Complété le ' + esc(when) : '') + '</div>' +
      (inst.description ? '<p style="font-size:13.5px;color:#6b5b45;margin:-14px 0 22px">' + esc(inst.description) + '</p>' : '') +
      sections +
      '<footer>Seed to Bloom · seedtobloom.fr</footer>' +
      '<scr' + 'ipt>window.onload=function(){setTimeout(function(){window.print();},300);};</scr' + 'ipt>' +
      '</body></html>';
    var w = window.open('', '_blank');
    if (!w) { toast('Autorise les fenêtres pop-up pour l\'export PDF'); return; }
    w.document.open(); w.document.write(doc); w.document.close();
  }
  function qnrDelete(id, name) {
    admConfirm({ title: 'Supprimer ce questionnaire ?', message: '« ' + name + ' » et les réponses de la cliente seront supprimés définitivement.', yes: 'Supprimer', no: 'Annuler', danger: true }, function () {
      api('/api/clients/' + CURKEY + '/questionnaires/' + id, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Questionnaire supprimé'); loadClient(); } else toast('Erreur'); }).catch(function () { toast('Erreur'); });
    });
  }
  // Marque comme « consultés » les questionnaires complétés de la cliente courante.
  function qnrMarkSeen() {
    (CUR.questionnaires || []).forEach(function (q) {
      if ((q.status === 'completed' || q.status === 'to_review') && q.seenByAdmin !== true) {
        q.seenByAdmin = true;
        jpost('/api/clients/' + CURKEY + '/questionnaires/' + q.id, { seenByAdmin: true }, 'PATCH').catch(function () {});
      }
    });
  }
  // Depuis Priorités : marquer consulté puis ouvrir la fiche cliente sur les réponses.
  function prioConsultQnr(key, id) {
    jpost('/api/clients/' + key + '/questionnaires/' + id, { seenByAdmin: true }, 'PATCH').catch(function () {});
    navClientTab(key, 'qnranswers');
  }
  function bilanAvisTab() {
    var partner = (CUR.domains || []).filter(function (x) { return x.id === 'partner'; })[0];
    var bil = partner ? bilanCard(partner) : '<div class="card" style="max-width:680px"><h3>Bilan de collaboration</h3><div class="micro">Le bilan concerne l\'accompagnement Partenaire créative, qui n\'est pas activé pour ce client.</div></div>';
    return bil + spaceFeedbackCard();
  }
  function spaceFeedbackCard() {
    var fb = (CUR.spaceFeedback || []).slice().sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
    var rows = fb.length ? fb.map(function (f) {
      return '<div class="file"><span class="nm">' + (f.category ? '<span class="pill">' + esc(f.category) + '</span> ' : '') + esc(f.content) + '<div class="micro muted">' + fmtDate(f.createdAt) + '</div></span></div>';
    }).join('') : '<div class="empty">Aucun retour du client sur son espace pour le moment.</div>';
    return '<div class="card" style="max-width:680px"><h3>Avis du client sur son espace</h3>' +
      '<div class="micro mb">Ce que le client signale comme manquant ou peu clair dans son espace, pour vous aider à l\'améliorer.</div>' + rows + '</div>';
  }
  function bilanCard(d) {
    var b = d.content.bilan || null;
    var bens = Array.isArray(d.content.benefices) ? d.content.benefices : [];
    var bilanHtml;
    if (b && b.submittedAt) {
      bilanHtml = '<div class="micro mb">Reçu le ' + fmtDate(b.submittedAt) + '</div>' +
        '<div class="mb">' + bilanStars(b.rating || 0) + ' <span class="micro">' + (b.rating || 0) + '/5</span></div>' +
        '<div class="micro mb">Recommanderait le studio ' + (b.recommend ? '<span class="pill pill--done">oui</span>' : '<span class="pill">pas encore</span>') + '</div>' +
        (b.liked ? '<div class="field"><label>Ce qui a plu</label><div class="muted">' + esc(b.liked) + '</div></div>' : '') +
        (b.improve ? '<div class="field"><label>Pistes d\'amélioration</label><div class="muted">' + esc(b.improve) + '</div></div>' : '') +
        (b.testimonial ? '<div class="field"><label>Témoignage ' + (b.allowTestimonial ? '(publication autorisée)' : '(usage interne)') + '</label><div class="muted" style="font-style:italic">« ' + esc(b.testimonial) + ' »</div></div>' : '') +
        '<button class="btn btn--outline btn--sm mt" onclick="ADM.bilanRequest()">Renvoyer une invitation</button>';
    } else if (b && b.requestedAt) {
      bilanHtml = '<div class="micro mb">Invitation envoyée le ' + fmtDate(b.requestedAt) + '. En attente de la réponse du client.</div>' +
        '<button class="btn btn--outline btn--sm" onclick="ADM.bilanRequest()">Relancer l\'invitation</button>';
    } else {
      bilanHtml = '<div class="micro mb">Sollicitez le client en fin de collaboration pour recueillir son bilan (satisfaction, témoignage).</div>' +
        '<button class="btn btn--dark btn--sm" onclick="ADM.bilanRequest()">Demander le bilan</button>';
    }
    var rows = bens.length ? bens.map(function (x) {
      return '<div class="file"><span class="nm">' + esc(x.label) + (x.value ? ' <span class="pill pill--done">' + esc(x.value) + '</span>' : '') +
        '<div class="micro muted">' + fmtDate(x.date) + (x.note ? ' · ' + esc(x.note) : '') + '</div></span>' +
        '<button class="btn btn--danger btn--sm" onclick="ADM.beneficeDel(\'' + x.id + '\')">Suppr.</button></div>';
    }).join('') : '<div class="empty">Aucun bénéfice enregistré pour l\'instant.</div>';
    return '<div class="card" style="max-width:680px"><h3>Bilan de collaboration</h3>' + bilanHtml + '</div>' +
      '<div class="card" style="max-width:680px"><h3>Suivi des bénéfices</h3>' +
        '<div class="micro mb">Note les retombées concrètes après la collaboration (nouveaux clients, visibilité, chiffre d\'affaires).</div>' + rows +
        '<div class="row mt" style="flex-wrap:wrap;gap:8px">' +
          '<input class="inp" id="ben-label" placeholder="Bénéfice (ex. plus de demandes)">' +
          '<input class="inp" id="ben-value" style="width:120px" placeholder="Valeur">' +
          '<input class="inp" type="date" style="width:auto" id="ben-date">' +
          '<input class="inp" id="ben-note" placeholder="Note (optionnel)">' +
          '<button class="btn btn--sm" onclick="ADM.beneficeAdd()">+ Ajouter</button>' +
        '</div></div>';
  }
  function bilanRequest() {
    var email = (CUR && CUR.client && CUR.client.email) || '';
    var nm = ((CUR.client.prenom || '') + ' ' + (CUR.client.nom || '')).trim();
    admConfirm({
      title: 'Envoyer l\'invitation au bilan ?',
      message: 'Un e-mail sera envoyé' + (nm ? ' à ' + esc(nm) : ' au client') + ' pour l\'inviter à remplir son bilan de fin de collaboration.',
      detail: email ? 'Destinataire : <strong>' + esc(email) + '</strong>' : 'Attention : aucune adresse e-mail renseignée pour ce client.',
      yes: 'Oui, envoyer', no: 'Non, ne pas envoyer'
    }, function () {
      jpost('/api/clients/' + CURKEY + '/bilan/request', {}, 'POST').then(function (r) { if (r.ok) { toast('Invitation envoyée au client'); loadClient(); } else toast('Erreur'); });
    });
  }
  function beneficeAdd() { var label = (el('ben-label').value || '').trim(); if (!label) { toast('Indique un bénéfice'); return; } jpost('/api/clients/' + CURKEY + '/benefices', { label: label, value: el('ben-value').value || '', note: el('ben-note').value || '', date: el('ben-date').value || '' }, 'POST').then(function (r) { if (r.ok) { toast('Bénéfice ajouté'); loadClient(); } else toast('Erreur'); }); }
  function beneficeDel(id) {
    admConfirm({ title: 'Retirer ce bénéfice ?', yes: 'Oui, retirer', no: 'Non', danger: true }, function () {
      api('/api/clients/' + CURKEY + '/benefices/' + id, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Supprimé'); loadClient(); } else toast('Erreur'); });
    });
  }
  function saveForfait() { jpost('/api/clients/' + CURKEY + '/forfait', { projectId: 'partner', monthlyHours: Number(el('pf-h').value) || 0 }, 'PATCH').then(function (r) { if (r.ok) { toast('Forfait mis à jour'); loadClient(); } }); }
  function taskStatus(id, st) { if (st === 'done' && PT_TIMER && PT_TIMER.id === id) ptPause(id, true); var lbl = { todo: 'À faire', in_progress: 'En cours', review: 'À valider', done: 'Terminée' }[st] || st; jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', status: st }, 'PATCH').then(function (r) { if (r.ok) { toast('Statut : ' + lbl); loadClient(); } }); }
  function taskDelete(id) {
    admConfirm({ title: 'Supprimer cette tâche ?', message: 'La tâche, ses commentaires et son temps passé seront supprimés.', yes: 'Oui, supprimer', no: 'Non', danger: true }, function () {
      if (PT_TIMER && PT_TIMER.id === id) ptPause(id, true);
      api('/api/clients/' + CURKEY + '/tasks/' + id + '?projectId=partner', { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Tâche supprimée'); loadClient(); } else toast('Erreur'); });
    });
  }
  function taskTime(id, mn) { var m = Number(mn) || 0; var loc = ptFind(id); if (loc) { loc.timeSpentMinutes = m; loc.timeSpentSeconds = m * 60; } jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', timeSpentMinutes: m, timeSpentSeconds: m * 60, forceTime: true }, 'PATCH').then(function (r) { if (r.ok) toast('Temps enregistré'); }); }
  function taskComment(pid, id) { var i = el('cm-' + id); var v = (i.value || '').trim(); if (!v) return; jpost('/api/clients/' + CURKEY + '/tasks/' + id + '/comments', { projectId: pid, text: v }).then(function (r) { if (r.ok) { toast('Commentaire envoyé'); loadClient(); } }); }

  /* suivi (étapes) */
  function suiviCard(d) {
    var steps = (d.content.suivi || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var rows = steps.length ? steps.map(function (s) {
      var opts = STEP_STATUS.map(function (x) { return '<option value="' + x[0] + '"' + (s.status === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('');
      return '<tr><td><strong>' + esc(s.title) + '</strong>' + (s.description ? '<div class="muted" style="font-size:13px">' + esc(s.description) + '</div>' : '') + '</td>' +
        '<td>' + fmtDate(s.date) + '</td>' +
        '<td><select class="inp" style="width:auto" onchange="ADM.stepStatus(\'' + d.id + '\',\'' + s.id + '\',this.value)">' + opts + '</select></td>' +
        '<td><div class="row" style="gap:5px;flex-wrap:nowrap"><button class="pbtn" onclick="ADM.stepEditOpen(\'' + d.id + '\',\'' + s.id + '\')" title="Modifier l\'étape">Modifier</button>' +
        '<button class="btn btn--danger btn--sm" onclick="ADM.stepDelete(\'' + d.id + '\',\'' + s.id + '\')">Suppr.</button></div></td></tr>';
    }).join('') : '<tr><td colspan="4" class="empty">Aucune étape pour l\'instant. Ajoutez la première ci-dessous, elle s\'affichera dans l\'espace du client.</td></tr>';
    return '<div class="card"><h3>Étapes du projet</h3>' +
      '<div class="micro mb">Les étapes jalonnent le projet et sont visibles par le client (par exemple « Brief », « Maquettes », « Livraison »).</div>' +
      '<table><thead><tr><th>Étape</th><th>Date</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div style="background:var(--surface);border:1px solid var(--bone-d);border-radius:10px;padding:12px 14px;margin-top:14px">' +
      '<div class="micro mb"><strong>Ajouter une étape</strong></div>' +
      '<div class="row" style="gap:8px;align-items:flex-end"><input class="inp" id="st-title-' + d.id + '" placeholder="Intitulé (ex. Maquettes)" style="flex:1;min-width:150px"><input class="inp" type="date" style="width:auto" id="st-date-' + d.id + '">' +
      '<input class="inp" id="st-action-' + d.id + '" placeholder="Action attendue du client (optionnel)" style="flex:1;min-width:150px"><button class="btn btn--dark btn--sm" onclick="ADM.stepAdd(\'' + d.id + '\')">+ Ajouter l\'étape</button></div></div></div>';
  }
  function stepAdd(pid) { var t = el('st-title-' + pid).value.trim(); if (!t) return; jpost('/api/clients/' + CURKEY + '/steps', { projectId: pid, title: t, date: el('st-date-' + pid).value || null, clientAction: el('st-action-' + pid).value || '', status: 'upcoming' }).then(function (r) { if (r.ok) { toast('Étape ajoutée'); loadClient(); } }); }
  function stepEditOpen(pid, id) {
    var d = findDomain(pid); if (!d) return;
    var st = (d.content.suivi || []).filter(function (x) { return x.id === id; })[0]; if (!st) return;
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:520px;text-align:left">' +
      '<div class="admconfirm__title">Modifier l\'étape</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">' +
        '<div class="field"><label>Intitulé</label><input class="inp" id="ste-title" value="' + esc(st.title || '') + '"></div>' +
        '<div class="field"><label>Date</label><input class="inp" id="ste-date" type="date" value="' + esc((st.date || '').slice(0, 10)) + '" style="width:auto"></div>' +
        '<div class="field"><label>Description (visible par le client)</label><textarea class="inp" id="ste-desc" style="min-height:64px;resize:vertical">' + esc(st.description || '') + '</textarea></div>' +
        '<div class="field"><label>Action attendue du client</label><input class="inp" id="ste-action" value="' + esc(st.clientAction || '') + '"></div>' +
      '</div>' +
      '<div class="admconfirm__row"><button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Enregistrer</button></div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var title = (el('ste-title').value || '').trim(); if (!title) { toast('Intitulé requis'); return; }
      jpost('/api/clients/' + CURKEY + '/steps/' + id, { projectId: pid, title: title, date: el('ste-date').value || null, description: (el('ste-desc').value || '').trim(), clientAction: (el('ste-action').value || '').trim() }, 'PATCH')
        .then(function (r) { if (r.ok) { close(); toast('Étape modifiée'); loadClient(); } else toast('Erreur'); });
    };
    document.body.appendChild(ov);
    var f = el('ste-title'); if (f) f.focus();
  }
  function stepStatus(pid, id, st) { jpost('/api/clients/' + CURKEY + '/steps/' + id, { projectId: pid, status: st }, 'PATCH').then(function (r) { if (r.ok) { toast('Statut mis à jour'); loadClient(); } }); }
  function stepDelete(pid, id) {
    admConfirm({ title: 'Supprimer cette étape ?', yes: 'Oui, supprimer', no: 'Non', danger: true }, function () {
      api('/api/clients/' + CURKEY + '/steps/' + id + '?projectId=' + pid, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Supprimé'); loadClient(); } else toast('Erreur'); });
    });
  }

  /* livrables */
  function livrablesCard(d) {
    var ls = d.content.livrables || [];
    var rows = ls.length ? ls.map(function (l) {
      return '<div class="file"><span class="nm">' + esc(l.name) + ' ' + pill(l.status, { a_valider: 'à valider', valide: 'validé', refuse: 'à revoir' }[l.status] || l.status) + (l.clientComment ? '<div class="muted" style="font-size:13px">« ' + esc(l.clientComment) + ' »</div>' : '') + '</span>' +
        (l.fileKey ? '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(l.fileKey) + '/download">Télécharger</a>' : '') + '</div>';
    }).join('') : '<div class="empty">Aucun livrable. Déposes-en un depuis l\'onglet Documents (case « livrable »).</div>';
    return '<div class="card"><h3>Livrables</h3>' + rows + '</div>';
  }

  /* chat par projet */
  function hi(s, q) {
    s = String(s == null ? '' : s); if (!q) return esc(s);
    var ql = q.toLowerCase(), low = s.toLowerCase(), out = '', i = 0;
    while (true) { var idx = low.indexOf(ql, i); if (idx === -1) { out += esc(s.slice(i)); break; } out += esc(s.slice(i, idx)) + '<mark style="background:#fbe39a;border-radius:3px;padding:0 1px">' + esc(s.slice(idx, idx + ql.length)) + '</mark>'; i = idx + ql.length; }
    return out;
  }
  function admClientInitial() { var c = (CUR && CUR.client) || {}; var s = (c.prenom || c.nom || '').trim(); return (s ? s[0] : '•').toUpperCase(); }
  function chatBubbles(d, q) {
    var all = d.content.chat || [];
    var ql = (q || '').toLowerCase();
    var msgs = ql ? all.filter(function (m) { return (m.message || '').toLowerCase().indexOf(ql) !== -1; }) : all;
    if (!all.length) return '<div class="empty">Aucun message.</div>';
    if (!msgs.length) return '<div class="empty">Aucun message ne contient ce mot.</div>';
    function bub(m) {
      var mine = m.from === 'cindy';
      var av = '<span class="aavatar aavatar--' + (mine ? 'cindy' : 'client') + '">' + (mine ? 'C' : admClientInitial()) + '</span>';
      return '<div class="msg msg--' + (mine ? 'cindy' : 'client') + '">' + av + '<div><div class="bubble"' + (m.pinned ? ' style="box-shadow:inset 0 0 0 1px #e8c98a"' : '') + '>' + (m.pinned ? '<span style="display:block;font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.06em;color:#a07a2a;margin-bottom:3px">📌 Épinglé</span>' : '') + hi(m.message, q) + '</div><div class="bmeta">' + (mine ? 'Vous' : 'Client') + ' · ' + fmtDT(m.date) + ' · <span style="cursor:pointer;text-decoration:underline" onclick="ADM.pinMsg(\'' + d.id + '\',\'' + m.id + '\',' + (m.pinned ? 'false' : 'true') + ')">' + (m.pinned ? 'détacher' : 'épingler') + '</span></div></div></div>';
    }
    var pinned = msgs.filter(function (m) { return m.pinned; });
    var rest = msgs.filter(function (m) { return !m.pinned; });
    return pinned.map(bub).join('') + rest.map(bub).join('');
  }
  function pinMsg(pid, id, pin) {
    jpost('/api/clients/' + CURKEY + '/message/' + id + '/pin', { projectId: pid, pinned: pin }, 'PATCH').then(function (r) {
      if (!r.ok) { toast('Erreur'); return; }
      toast(pin ? 'Message épinglé' : 'Message détaché');
      if (VIEW === 'client') loadClient(); else if (VIEW === 'chat' && CHAT && CHAT.project) chatProject(CHAT.project);
    });
  }
  function chatCard(d) {
    return '<div class="card"><h3>Messages · ' + esc(DOMAIN_LABELS[d.id] || d.label) + '</h3>' +
      '<div class="row mb"><input type="search" class="inp" placeholder="Rechercher dans la discussion…" oninput="ADM.chatCardSearch(\'' + d.id + '\',this.value)"></div>' +
      '<div class="msgs" id="chat-' + d.id + '">' + chatBubbles(d, '') + '</div>' +
      '<div class="row"><textarea class="inp" id="msg-' + d.id + '" placeholder="Répondre au client…" style="max-height:300px;overflow-y:auto" oninput="ADM.taGrow(this)"></textarea></div>' +
      '<div class="row row--end mt" style="gap:8px"><button class="btn btn--outline btn--sm" title="Insérer une réponse rapide" onclick="ADM.qrPick(\'msg-' + d.id + '\')">⚡ Réponses</button><button class="btn btn--dark btn--sm" onclick="ADM.sendMsg(\'' + d.id + '\')">Envoyer</button></div></div>';
  }
  function chatCardSearch(domainId, v) { var d = findDomain(domainId); var box = el('chat-' + domainId); if (d && box) box.innerHTML = chatBubbles(d, v); }
  function sendMsg(pid) {
    var i = el('msg-' + pid); var v = (i.value || '').trim(); if (!v) return;
    jpost('/api/clients/' + CURKEY + '/message', { projectId: pid, content: v }).then(function (r) { if (r.ok) { toast('Message envoyé'); loadClient(); } else toast('Erreur'); });
  }

  /* documents */
  function renderDocuments(body) {
    var projects = [];
    CUR.domains.forEach(function (dn) { projects.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label]); });
    CUR.supports.forEach(function (s) { projects.push([s.id, s.label]); });
    var opts = projects.map(function (p) { return '<option value="' + p[0] + '">' + esc(p[1]) + '</option>'; }).join('');
    body.innerHTML = '<div class="card"><h3>Déposer un document</h3>' +
      '<div class="row">' +
      '<select class="inp" id="up-proj" style="width:auto" onchange="ADM.listDocs()">' + opts + '</select>' +
      '<label class="checkbox"><input type="checkbox" id="up-liv"> livrable (validable par le client)</label>' +
      '</div>' +
      '<div class="row mt"><input class="inp" type="file" id="up-file"><button class="btn btn--dark btn--sm" id="up-btn" onclick="ADM.upload()">Uploader</button></div>' +
      '<div class="micro mt">Décochez « livrable » pour un document administratif (devis, facture, contrat…).</div></div>' +
      '<div class="card"><h3>Documents du projet</h3><div id="doclist"><div class="empty">·</div></div></div>';
    listDocs();
  }
  function listDocs() {
    var pid = el('up-proj').value;
    api('/api/clients/' + CURKEY + '/files?projectId=' + encodeURIComponent(pid)).then(function (r) { return r.json(); }).then(function (d) {
      var pid2 = el('up-proj').value;
      var list = (d.files || []).map(function (f) {
        return '<div class="file"><span class="nm">' + esc(f.name) + ' ' + pill(f.category === 'deliverable' ? 'a_valider' : 'todo', f.category === 'deliverable' ? 'livrable' : 'document') + (f.source === 'client' ? ' <span class="pill">déposé client</span>' : '') + (f.locked ? ' <span class="pill pill--done">verrouillé</span>' : '') + '</span>' +
          '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(f.key) + '/download">↓</a>' +
          '<button class="btn btn--outline btn--sm" onclick="ADM.lockDoc(\'' + encodeURIComponent(f.key) + '\',\'' + pid2 + '\',' + (f.locked ? 'false' : 'true') + ')">' + (f.locked ? 'Déverrouiller' : 'Verrouiller') + '</button>' +
          '<button class="btn btn--danger btn--sm" onclick="ADM.delDoc(\'' + encodeURIComponent(f.key) + '\')">Suppr.</button></div>';
      }).join('') || '<div class="empty">Aucun document.</div>';
      var dl = el('doclist'); if (dl) dl.innerHTML = list;
    });
  }
  function upload() {
    var f = el('up-file').files[0]; if (!f) { toast('Choisis un fichier'); return; }
    if (admTooBig(f)) { toast(admBigMsg(f)); return; }
    var fd = new FormData(); fd.append('file', f); fd.append('projectId', el('up-proj').value); if (el('up-liv').checked) fd.append('deliverable', '1');
    var btn = el('up-btn'); btn.disabled = true; btn.textContent = 'Envoi…';
    api('/api/clients/' + CURKEY + '/files', { method: 'POST', body: fd }).then(admUploadResult)
      .then(function (res) { btn.disabled = false; btn.textContent = 'Uploader'; if (res.ok) { toast('Document déposé'); el('up-file').value = ''; listDocs(); } else toast(admUploadErrMsg(res.status, res.d && res.d.error)); })
      .catch(function () { btn.disabled = false; btn.textContent = 'Uploader'; toast('Erreur — envoi impossible (fichier volumineux ? envoie-le en lien).'); });
  }
  function delDoc(k) {
    admConfirm({ title: 'Supprimer ce document ?', message: 'Le fichier sera supprimé pour vous et pour le client.', yes: 'Oui, supprimer', no: 'Non', danger: true }, function () {
      jpost('/api/clients/' + CURKEY + '/files', { key: decodeURIComponent(k) }, 'DELETE').then(function (r) { if (r.ok) { toast('Supprimé'); listDocs(); } else toast('Erreur'); });
    });
  }
  function lockDoc(k, pid, lock) { jpost('/api/clients/' + CURKEY + '/files/lock', { key: decodeURIComponent(k), projectId: pid, locked: lock }, 'PATCH').then(function (r) { if (r.ok) { toast(lock ? 'Fichier verrouillé' : 'Fichier déverrouillé'); listDocs(); } else toast('Erreur'); }); }

  /* ── Messagerie globale : clients -> projet -> fil ── */
  function renderChat() {
    setMain(topbar('Messagerie') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/clients').then(function (r) { return r.json(); }).then(function (d) {
      var clients = (d.clients || []).slice().sort(function (a, b) { return (b.unread || 0) - (a.unread || 0); });
      var waiting = clients.filter(function (c) { return (c.unread || 0) > 0; }).length;
      var list = clients.map(function (c) {
        var nm = ((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.entreprise || c.email || c.key;
        var u = c.unread || 0;
        var ini = (nm ? nm[0] : '?').toUpperCase();
        return '<button class="chatperson' + (u ? ' unread' : '') + '" id="cp-' + c.key + '" onclick="ADM.chatClient(\'' + c.key + '\')">' +
          '<span class="aavatar aavatar--client">' + esc(ini) + '</span>' +
          '<span class="chatperson__nm">' + esc(nm) + '</span>' +
          (u ? '<span class="pill pill--a_valider">' + u + '</span>' : '') + '</button>';
      }).join('') || '<div class="empty">Aucun client.</div>';
      var head = '<div class="chathead__t" style="font-size:18px">Conversations</div>' + (waiting ? '<div class="micro" style="color:#b8871f;font-weight:700;margin-top:3px">' + waiting + ' en attente</div>' : '<div class="micro" style="color:#5d7a52;margin-top:3px">Tout est lu ✓</div>');
      setMain(topbar('Messagerie') + '<div class="wrap" style="max-width:1180px">' +
        '<div class="chatwrap">' +
          '<div class="chatlist"><div class="chatlist__head">' + head + '</div><div class="chatlist__scroll">' + list + '</div></div>' +
          '<div class="chatpane" id="chatpane"><div class="empty" style="margin:auto">Choisis une conversation.</div></div>' +
        '</div></div>');
    }).catch(showError);
  }
  function chatClient(key) {
    api('/api/clients/' + key).then(function (r) { return r.json(); }).then(function (d) {
      CHAT.key = key; CUR = d; CURKEY = key;
      var all = el('main').querySelectorAll('.chatperson'); for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
      var self = el('cp-' + key); if (self) self.classList.add('active');
      var items = [];
      d.domains.forEach(function (dn) { items.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label, dn.unread || 0]); });
      d.supports.forEach(function (s) { items.push([s.id, s.label, s.unread || 0]); });
      var nm = ((d.client.prenom || '') + ' ' + (d.client.nom || '')).trim() || d.key;
      var chips = items.length > 1 ? '<div class="chatchips" id="chatchips">' + items.map(function (p) {
        return '<button class="subtab" data-pid="' + p[0] + '" onclick="ADM.chatProject(\'' + p[0] + '\')">' + esc(p[1]) + (p[2] ? ' ' + badge(p[2]) : '') + '</button>';
      }).join('') + '</div>' : '';
      var ml = (d.meetingLink || '').trim();
      var visioBtn = ml ? '<a class="btn btn--outline btn--sm" style="margin-left:auto" href="' + esc(ml.indexOf('http') === 0 ? ml : 'https://' + ml) + '" target="_blank" rel="noopener" title="Rejoindre la visio">' + admIcon('video') + ' Visio</a>' : '';
      var pane = el('chatpane');
      if (pane) pane.innerHTML =
        '<div class="chathead"><span class="aavatar aavatar--client" style="width:42px;height:42px;font-size:18px">' + esc((nm[0] || '?').toUpperCase()) + '</span>' +
          '<div><div class="chathead__t">' + esc(nm) + '</div><div class="chathead__s">' + (d.client.email ? esc(d.client.email) : 'Client') + '</div></div>' + visioBtn + '</div>' +
        chips + '<div class="chatbody" id="chatthread"></div>';
      var auto = items.filter(function (p) { return p[2] > 0; })[0] || items[0];
      if (auto) chatProject(auto[0]);
    });
  }
  function chatProject(pid) {
    CHAT.project = pid;
    var d = findDomain(pid); if (!d) return;
    var box = el('chatthread'); if (!box) return;
    var chips = el('chatchips'); if (chips) { var bs = chips.querySelectorAll('.subtab'); for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('active', bs[i].getAttribute('data-pid') === pid); }
    box.innerHTML = '<div class="chatscroll" id="chatmsgs">' + chatBubbles(d, '') + '</div>' +
      '<div class="chatcompose"><textarea class="inp" id="gmsg" placeholder="Répondre au client…" onkeydown="ADM.chatKey(event)" oninput="ADM.taGrow(this)"></textarea>' +
      '<button class="btn btn--outline" title="Insérer une réponse rapide" onclick="ADM.qrPick(\'gmsg\')">⚡</button>' +
      '<button class="btn btn--dark" onclick="ADM.gsend()">Envoyer</button></div>';
    var box2 = el('chatmsgs'); if (box2) box2.scrollTop = box2.scrollHeight;
    if (d.unread > 0) { jpost('/api/clients/' + CHAT.key + '/message/read', { projectId: pid }, 'POST'); d.unread = 0; var self = el('cp-' + CHAT.key); if (self) self.classList.remove('unread'); }
  }
  // Zone de saisie qui grandit avec le texte (pour voir ce qu'on écrit sans scroller).
  function taGrow(t) { if (!t) return; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 300) + 'px'; }
  function chatKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gsend(); } }
  function chatSearch(v) { var d = findDomain(CHAT.project); var box = el('chatmsgs'); if (d && box) box.innerHTML = chatBubbles(d, v); }
  function gsend() {
    var i = el('gmsg'); var v = (i.value || '').trim(); if (!v) return;
    jpost('/api/clients/' + CHAT.key + '/message', { projectId: CHAT.project, content: v }).then(function (r) {
      if (!r.ok) { toast('Erreur'); return; }
      i.value = ''; taGrow(i);
      api('/api/clients/' + CHAT.key).then(function (r2) { return r2.json(); }).then(function (d) {
        if (CHAT.key !== d.key) return;
        CUR = d; CURKEY = CHAT.key;
        var dom = findDomain(CHAT.project); var box = el('chatmsgs');
        if (dom && box) { box.innerHTML = chatBubbles(dom, ''); box.scrollTop = box.scrollHeight; }
      });
    });
  }

  /* ── Avis : bilans + avis sur l'espace (hero + onglets) ── */
  var AVIS_TAB = 'bilans', AVIS_D = null;
  function avisSetTab(v) { AVIS_TAB = v; if (AVIS_D) renderAvisBody(AVIS_D); }
  function renderAvis() {
    setMain(topbar('Avis') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/avis').then(function (r) { return r.json(); }).then(function (d) { AVIS_D = d; renderAvisBody(d); }).catch(showError);
  }
  function renderAvisBody(d) {
    var avis = d.avis || [], bilans = d.bilans || [];
    var rated = bilans.filter(function (b) { return b.rating; });
    var avg = rated.length ? (rated.reduce(function (s, b) { return s + b.rating; }, 0) / rated.length) : 0;
    var reco = bilans.filter(function (b) { return b.recommend; }).length;
    function kc(n, l) { return '<div class="kpi"><div class="kpi__n">' + n + '</div><div class="kpi__l">' + l + '</div></div>'; }
    var hero = (bilans.length || avis.length) ? '<div class="kpis">' +
      kc(bilans.length, 'Bilans reçus') +
      kc(avg ? avg.toFixed(1).replace('.0', '') + '/5' : '·', 'Note moyenne') +
      kc(bilans.length ? Math.round(reco / bilans.length * 100) + ' %' : '·', 'Recommandent') +
      kc(avis.length, 'Avis sur l\'espace') + '</div>' : '';
    var avisRows = avis.length ? avis.map(function (a) {
      return '<div class="card" style="max-width:760px"><div class="between"><strong>' + esc(a.client) + '</strong><span class="micro">' + (a.category ? esc(a.category) + ' · ' : '') + fmtDate(a.createdAt) + '</span></div><div class="muted mt" style="white-space:pre-wrap;line-height:1.5">' + esc(a.content) + '</div></div>';
    }).join('') : '<div class="empty">Aucun avis sur l\'espace pour le moment. Les clients le laissent depuis l\'onglet « Votre avis » de leur espace.</div>';
    var bilRows = bilans.length ? bilans.map(function (b) {
      var stars = ''; for (var i = 1; i <= 5; i++) stars += '<span style="font-size:17px;color:' + ((b.rating >= i) ? '#d8a93a' : '#d9cfbe') + '">★</span>';
      return '<div class="card" style="max-width:760px"><div class="between"><strong>' + esc(b.client) + '</strong><span class="micro">' + fmtDate(b.submittedAt) + '</span></div>' +
        '<div class="mt">' + stars + ' ' + (b.recommend ? '<span class="pill pill--done">recommande</span>' : '<span class="pill">pas encore</span>') + '</div>' +
        (b.testimonial ? '<div class="muted mt" style="font-style:italic">« ' + esc(b.testimonial) + ' »' + (b.allowTestimonial ? ' <span class="pill pill--done">publiable</span>' : ' <span class="pill">interne</span>') + '</div>' : '') +
        (b.liked ? '<div class="micro mt">Ce qui a plu : ' + esc(b.liked) + '</div>' : '') +
        (b.improve ? '<div class="micro mt">À améliorer : ' + esc(b.improve) + '</div>' : '') + '</div>';
    }).join('') : '<div class="empty">Aucun bilan de collaboration reçu.</div>';
    var tabDefs = [['bilans', 'Bilans de collaboration', bilans.length], ['avis', 'Avis sur l\'espace', avis.length]];
    if (!tabDefs.some(function (x) { return x[0] === AVIS_TAB; })) AVIS_TAB = 'bilans';
    var tabBar = '<div class="tabs">' + tabDefs.map(function (x) {
      return '<button class="tab' + (AVIS_TAB === x[0] ? ' active' : '') + '" onclick="ADM.avisSetTab(\'' + x[0] + '\')">' + esc(x[1]) + badge(x[2]) + '</button>';
    }).join('') + '</div>';
    var body = AVIS_TAB === 'avis'
      ? '<div class="micro mb">Ce que les clients signalent pour améliorer leur espace (manques, incompréhensions, suggestions).</div>' + avisRows
      : '<div class="micro mb">Retours de satisfaction reçus à la fin des accompagnements.</div>' + bilRows;
    setMain(topbar('Avis', '', 'Les retours et bilans remplis par tes clients') + '<div class="wrap">' + hero + tabBar + '<div id="avisbody">' + body + '</div></div>');
  }

  /* ────────────────────────────────────────────────────────────────────────
   * Questionnaires — plateforme générique (bibliothèque + éditeur par blocs +
   * assignation aux clientes). Les modèles sont réutilisables ; on en envoie un
   * instantané à chaque cliente (ses réponses ne cassent pas si on édite après).
   * ──────────────────────────────────────────────────────────────────────── */
  var QNR = [], QNR_LOADED = false, QNR_SEL = null, QNR_SHOW_ARCH = false;
  var QNR_CATS = [
    ['demarrage', 'Démarrage', '#5e3fa0'], ['strategie', 'Stratégie', '#2f6b8a'],
    ['seo', 'SEO', '#3f8a5e'], ['ux', 'UX / UI', '#8a5e2f'], ['branding', 'Branding', '#a03f7a'],
    ['copywriting', 'Copywriting', '#8a2f4a'], ['projet', 'Projet', '#3f5aa0'],
    ['livraison', 'Livraison', '#2f8a8a'], ['support', 'Support', '#6b6b2f'], ['autre', 'Autre', '#6b5e4a'],
  ];
  // Types de blocs proposés dans l'éditeur (alignés sur le back).
  var QNR_BLOCKS = [
    ['title', 'Titre de section', '¶'], ['paragraph', 'Texte / consigne', '≡'],
    ['short', 'Réponse courte', '—'], ['long', 'Réponse longue', '☰'],
    ['single', 'Choix unique', '◉'], ['multi', 'Choix multiple', '☑'], ['dropdown', 'Liste déroulante', '▾'],
    ['ranking', 'Classement (1→N)', '⇅'],
    ['number', 'Nombre', '#'], ['email', 'E-mail', '@'], ['phone', 'Téléphone', '☎'],
    ['date', 'Date', '📅'], ['time', 'Heure', '⏱'], ['address', 'Adresse', '⌂'],
    ['rating', 'Note (étoiles)', '★'], ['slider', 'Curseur', '⇔'], ['url', 'Lien / URL', '🔗'], ['file', 'Fichier', '📎'],
  ];
  function qnrCatMeta(cat) { for (var i = 0; i < QNR_CATS.length; i++) if (QNR_CATS[i][0] === cat) return QNR_CATS[i]; return QNR_CATS[QNR_CATS.length - 1]; }
  function qnrBlockLabel(type) { for (var i = 0; i < QNR_BLOCKS.length; i++) if (QNR_BLOCKS[i][0] === type) return QNR_BLOCKS[i][1]; return type; }
  function qnrHasOptions(type) { return type === 'single' || type === 'multi' || type === 'dropdown' || type === 'ranking'; }
  function qnrIsStatic(type) { return type === 'title' || type === 'paragraph'; }
  var QNR_SEQ = 0;
  // Identifiant garanti unique dans la session (un compteur évite les collisions
  // quand on crée beaucoup de blocs d'un coup, ex. import d'un long texte).
  function qnrId(p) { QNR_SEQ++; return (p || 'q') + Date.now().toString(36) + QNR_SEQ.toString(36); }
  function qnrTpl(id) { for (var i = 0; i < QNR.length; i++) if (QNR[i].id === id) return QNR[i]; return null; }
  function qnrCountBlocks(t) { var n = 0; (t.steps || []).forEach(function (s) { (s.blocks || []).forEach(function (b) { if (!qnrIsStatic(b.type)) n++; }); }); return n; }

  function renderQuestionnaires() {
    var right = '<button class="btn btn--dark btn--sm" onclick="ADM.qnrAdd()">+ Nouveau questionnaire</button>';
    setMain(topbar('Questionnaires', right, 'Crée des questionnaires réutilisables et envoie-les à tes clientes') + '<div class="wrap" id="qnr-body"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    if (!NAV_CLIENTS.length) { api('/api/clients').then(function (r) { return r.json(); }).then(function (d) { NAV_CLIENTS = d.clients || []; }).catch(function () {}); }
    if (QNR_LOADED) { renderQnrBody(); return; }
    api('/api/questionnaires').then(function (r) { return r.json(); }).then(function (d) { QNR = (d && d.questionnaires) || []; QNR_LOADED = true; renderQnrBody(); }).catch(showError);
  }
  function qnrSave() { jpost('/api/questionnaires', { questionnaires: QNR }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement'); }).catch(function () { toast('Erreur'); }); }

  function renderQnrBody() {
    var body = el('qnr-body'); if (!body) return;
    var active = QNR.filter(function (t) { return !t.archived; });
    var archived = QNR.filter(function (t) { return t.archived; });
    var grid = active.length
      ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">' + active.map(qnrTplCardHtml).join('') + '</div>'
      : '<div class="empty">Aucun questionnaire pour l\'instant. Crée ton premier modèle (ex. « Questions de démarrage », « Brief branding »), puis envoie-le à une ou plusieurs clientes.</div>';
    var archBtn = archived.length ? '<button class="btn btn--outline btn--sm" style="margin-top:22px" onclick="ADM.qnrToggleArch()">' + (QNR_SHOW_ARCH ? 'Masquer' : 'Voir') + ' les archivés · ' + archived.length + '</button>' : '';
    var archGrid = (QNR_SHOW_ARCH && archived.length) ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:14px;opacity:0.75">' + archived.map(qnrTplCardHtml).join('') + '</div>' : '';
    body.innerHTML = grid + archBtn + archGrid;
  }
  function qnrTplCardHtml(t) {
    var cm = qnrCatMeta(t.category || 'autre');
    var col = t.color || cm[2];
    var nQ = qnrCountBlocks(t), nS = (t.steps || []).length;
    return '<div class="card" style="padding:0;overflow:hidden;border:1px solid var(--bone-d);border-radius:14px;display:flex;flex-direction:column">' +
      '<div style="height:6px;background:' + esc(col) + '"></div>' +
      '<div style="padding:15px 16px;flex:1;display:flex;flex-direction:column;gap:8px">' +
        '<div class="between" style="align-items:flex-start;gap:8px">' +
          '<strong style="font-size:15.5px;line-height:1.3;cursor:pointer" onclick="ADM.qnrOpen(\'' + t.id + '\')">' + esc(t.name || 'Sans titre') + '</strong>' +
          '<span style="font-family:var(--font-micro);font-size:9.5px;text-transform:uppercase;letter-spacing:0.04em;color:#fff;background:' + esc(col) + ';padding:3px 8px;border-radius:999px;white-space:nowrap;flex-shrink:0">' + esc(cm[1]) + '</span>' +
        '</div>' +
        (t.description ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);line-height:1.45">' + esc(t.description) + '</div>' : '') +
        '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:auto">' + nS + ' étape' + (nS > 1 ? 's' : '') + ' · ' + nQ + ' question' + (nQ > 1 ? 's' : '') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;padding:9px 12px;border-top:1px solid var(--bone-d);flex-wrap:wrap">' +
        '<button class="pbtn" onclick="ADM.qnrOpen(\'' + t.id + '\')">Éditer</button>' +
        '<button class="pbtn" onclick="ADM.qnrPreview(\'' + t.id + '\')">Aperçu</button>' +
        '<button class="pbtn pbtn--ok" onclick="ADM.qnrAssignOpen(\'' + t.id + '\')">Envoyer</button>' +
        '<span style="margin-left:auto;display:flex;gap:4px">' +
          '<button class="pbtn" title="Dupliquer" onclick="ADM.qnrDup(\'' + t.id + '\')">⧉</button>' +
          '<button class="pbtn" title="' + (t.archived ? 'Désarchiver' : 'Archiver') + '" onclick="ADM.qnrArchive(\'' + t.id + '\')">' + (t.archived ? '↩' : '🗄') + '</button>' +
          '<button class="pbtn" style="color:#c44" title="Supprimer" onclick="ADM.qnrDel(\'' + t.id + '\')">×</button>' +
        '</span>' +
      '</div>' +
    '</div>';
  }
  function qnrToggleArch() { QNR_SHOW_ARCH = !QNR_SHOW_ARCH; renderQnrBody(); }
  function qnrAdd() {
    var t = { id: qnrId('t'), name: '', description: '', category: 'demarrage', color: qnrCatMeta('demarrage')[2], archived: false, steps: [{ id: qnrId('s'), title: '', help: '', blocks: [] }] };
    QNR.unshift(t); qnrSave(); renderQnrBody(); qnrOpen(t.id);
  }
  function qnrDup(id) {
    var t = qnrTpl(id); if (!t) return;
    var copy = JSON.parse(JSON.stringify(t));
    copy.id = qnrId('t'); copy.name = (t.name || 'Sans titre') + ' (copie)'; copy.archived = false;
    (copy.steps || []).forEach(function (s) { s.id = qnrId('s'); (s.blocks || []).forEach(function (b) { b.id = qnrId('b'); }); });
    QNR.unshift(copy); qnrSave(); renderQnrBody(); toast('Questionnaire dupliqué');
  }
  function qnrArchive(id) { var t = qnrTpl(id); if (!t) return; t.archived = !t.archived; qnrSave(); renderQnrBody(); }
  function qnrDel(id) {
    admConfirm({ title: 'Supprimer ce questionnaire ?', message: 'Le modèle sera supprimé. Les questionnaires déjà envoyés aux clientes restent intacts.', yes: 'Supprimer', no: 'Annuler', danger: true }, function () {
      QNR = QNR.filter(function (t) { return t.id !== id; }); if (QNR_SEL === id) qnrCloseDrawer(); qnrSave(); renderQnrBody();
    });
  }
  function qnrSet(id, field, val) { var t = qnrTpl(id); if (!t) return; t[field] = val; if (field === 'category') t.color = qnrCatMeta(val)[2]; qnrSave(); renderQnrBody(); if (field === 'category' || field === 'color') renderQnrDrawer(); }

  // ── Éditeur (drawer droite) ──
  function qnrOpen(id) { QNR_SEL = id; renderQnrDrawer(); }
  function qnrCloseDrawer() { QNR_SEL = null; var d = el('qnr-drawer'); if (d) d.remove(); var b = el('qnr-drawer-bk'); if (b) b.remove(); }
  function renderQnrDrawer() {
    var ex = el('qnr-drawer');
    // On garde la position de défilement pour ne pas remonter en haut à chaque
    // édition (changement de type, ajout de bloc…).
    var keepScroll = ex ? ex.scrollTop : 0;
    if (ex) ex.remove(); var exb = el('qnr-drawer-bk'); if (exb) exb.remove();
    var t = qnrTpl(QNR_SEL); if (!t) return;
    var bk = document.createElement('div'); bk.id = 'qnr-drawer-bk'; bk.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.32);z-index:90'; bk.onclick = qnrCloseDrawer; document.body.appendChild(bk);
    var d = document.createElement('div'); d.id = 'qnr-drawer'; d.style.cssText = 'position:fixed;top:0;right:0;height:100vh;width:min(760px,97vw);background:var(--bg,#faf7f1);z-index:95;box-shadow:-20px 0 54px -18px rgba(28,18,5,0.45);overflow-y:auto';
    d.innerHTML = qnrDrawerHtml(t); document.body.appendChild(d);
    if (keepScroll) d.scrollTop = keepScroll;
  }
  function qnrDrawerHtml(t) {
    var cm = qnrCatMeta(t.category || 'autre');
    var catSel = '<select class="inp" style="width:auto" onchange="ADM.qnrSet(\'' + t.id + '\',\'category\',this.value)">' +
      QNR_CATS.map(function (c) { return '<option value="' + c[0] + '"' + (t.category === c[0] ? ' selected' : '') + '>' + esc(c[1]) + '</option>'; }).join('') + '</select>';
    var swatches = QNR_CATS.map(function (c) { return c[2]; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var colorDots = swatches.map(function (col) { return '<button title="' + esc(col) + '" onclick="ADM.qnrSet(\'' + t.id + '\',\'color\',\'' + col + '\')" style="width:22px;height:22px;border-radius:50%;background:' + col + ';border:2px solid ' + ((t.color || cm[2]) === col ? 'var(--terre)' : 'transparent') + ';cursor:pointer"></button>'; }).join('');
    var stepsHtml = (t.steps || []).map(function (s, i) { return qnrStepHtml(t, s, i, (t.steps || []).length); }).join('');
    return '<div style="position:sticky;top:0;background:var(--bg,#faf7f1);z-index:4;padding:14px 22px;border-bottom:1px solid var(--bone-d);display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<button onclick="ADM.qnrCloseDrawer()" class="btn btn--outline btn--sm">← Fermer</button>' +
        '<button onclick="ADM.qnrSmartImport(\'' + t.id + '\')" class="btn btn--sm" title="Coller un texte et le mettre en forme automatiquement">✨ Mettre en forme un texte</button>' +
        '<button onclick="ADM.qnrPreview(\'' + t.id + '\')" class="btn btn--sm">👁 Aperçu</button>' +
        '<button onclick="ADM.qnrAssignOpen(\'' + t.id + '\')" class="btn btn--dark btn--sm">Envoyer à une cliente</button>' +
        '<span style="margin-left:auto"></span>' +
        '<button onclick="ADM.qnrDel(\'' + t.id + '\')" class="btn btn--danger btn--sm">Suppr.</button>' +
      '</div>' +
      '<div style="padding:20px 24px 90px;max-width:720px">' +
        '<input class="inp" value="' + esc(t.name || '') + '" placeholder="Nom du questionnaire (ex. Questions de démarrage)" style="width:100%;box-sizing:border-box;font-size:20px;font-weight:600;margin-bottom:10px" onchange="ADM.qnrSet(\'' + t.id + '\',\'name\',this.value)">' +
        '<textarea class="inp" placeholder="Description courte (optionnel) — visible par la cliente en haut du questionnaire" style="width:100%;box-sizing:border-box;min-height:56px;resize:vertical;font-size:14px;line-height:1.5;margin-bottom:14px" onchange="ADM.qnrSet(\'' + t.id + '\',\'description\',this.value)">' + esc(t.description || '') + '</textarea>' +
        '<div class="row" style="gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:22px">' +
          '<span class="row" style="gap:8px;align-items:center"><span class="micro">Catégorie</span>' + catSel + '</span>' +
          '<span class="row" style="gap:6px;align-items:center"><span class="micro">Couleur</span>' + colorDots + '</span>' +
        '</div>' +
        '<div class="between" style="margin-bottom:12px;flex-wrap:wrap;gap:8px"><h3 style="margin:0">Étapes & questions</h3><span class="row" style="gap:8px"><button class="btn btn--sm" title="Rendre toutes les questions obligatoires et activer la réponse Autre" onclick="ADM.qnrBulkRequire(\'' + t.id + '\')">⚡ Tout obligatoire + Autre</button><button class="btn btn--outline btn--sm" onclick="ADM.qnrStepAdd(\'' + t.id + '\')">+ Étape</button></span></div>' +
        (stepsHtml || '<div class="empty" style="margin-bottom:10px">Ajoute une étape, puis des questions à l\'intérieur.</div>') +
        '<button class="btn btn--outline btn--sm" style="margin-top:6px" onclick="ADM.qnrStepAdd(\'' + t.id + '\')">+ Ajouter une étape</button>' +
      '</div>';
  }
  function qnrStepHtml(t, s, idx, total) {
    var blocks = Array.isArray(s.blocks) ? s.blocks : [];
    var blocksHtml = blocks.map(function (b, i) { return qnrBlockHtml(t, s, b, i, blocks.length); }).join('');
    var addSel = '<select class="inp" style="width:auto" onchange="if(this.value){ADM.qnrBlockAdd(\'' + t.id + '\',\'' + s.id + '\',this.value);this.value=\'\';}"><option value="">+ Ajouter une question…</option>' +
      QNR_BLOCKS.map(function (bt) { return '<option value="' + bt[0] + '">' + esc(bt[2] + '  ' + bt[1]) + '</option>'; }).join('') + '</select>';
    return '<div class="card" style="background:var(--card);padding:14px 15px;margin-bottom:14px;border:1px solid var(--bone-d);border-radius:12px">' +
      '<div class="row" style="gap:8px;align-items:center;margin-bottom:10px">' +
        '<span style="font-family:var(--font-micro);font-size:10px;color:var(--muted);flex-shrink:0;text-transform:uppercase;letter-spacing:0.04em">Étape ' + (idx + 1) + '</span>' +
        '<input class="inp" value="' + esc(s.title || '') + '" placeholder="Titre de l\'étape (ex. Votre projet)" style="flex:1;font-weight:600" onchange="ADM.qnrStepSet(\'' + t.id + '\',\'' + s.id + '\',\'title\',this.value)">' +
        '<button class="pbtn" title="Monter"' + (idx === 0 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.qnrStepMove(\'' + t.id + '\',\'' + s.id + '\',-1)">↑</button>' +
        '<button class="pbtn" title="Descendre"' + (idx === total - 1 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.qnrStepMove(\'' + t.id + '\',\'' + s.id + '\',1)">↓</button>' +
        '<button class="pbtn" style="color:#c44" title="Supprimer l\'étape" onclick="ADM.qnrStepDel(\'' + t.id + '\',\'' + s.id + '\')">×</button>' +
      '</div>' +
      '<input class="inp" value="' + esc(s.help || '') + '" placeholder="Sous-titre / consigne de l\'étape (optionnel)" style="width:100%;box-sizing:border-box;font-size:13px;margin-bottom:12px" onchange="ADM.qnrStepSet(\'' + t.id + '\',\'' + s.id + '\',\'help\',this.value)">' +
      (blocksHtml || '<div class="micro muted" style="text-transform:none;letter-spacing:0;padding:2px 0 10px">Aucune question dans cette étape.</div>') +
      '<div style="margin-top:6px">' + addSel + '</div>' +
    '</div>';
  }
  function qnrBlockHtml(t, s, b, idx, total) {
    var isStat = qnrIsStatic(b.type);
    // Sélecteur de type : permet de changer la fonction d'une question à tout
    // moment (ex. passer d'un choix unique à un choix multiple, ou à une réponse courte).
    var typeSel = '<select class="inp" title="Changer le type de cette question" style="width:auto;font-size:11.5px;padding:3px 6px;font-family:var(--font-micro);color:#fff;background:var(--terre);border-color:var(--terre)" onchange="ADM.qnrBlockChangeType(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',this.value)">' +
      QNR_BLOCKS.map(function (bt) { return '<option value="' + bt[0] + '"' + (b.type === bt[0] ? ' selected' : '') + '>' + esc(bt[2] + '  ' + bt[1]) + '</option>'; }).join('') + '</select>';
    var head = '<div class="row" style="gap:6px;align-items:center;margin-bottom:7px">' +
      typeSel +
      '<span style="margin-left:auto"></span>' +
      '<button class="pbtn" title="Monter"' + (idx === 0 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.qnrBlockMove(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',-1)">↑</button>' +
      '<button class="pbtn" title="Descendre"' + (idx === total - 1 ? ' disabled style="opacity:0.3"' : '') + ' onclick="ADM.qnrBlockMove(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',1)">↓</button>' +
      '<button class="pbtn" style="color:#c44" title="Supprimer" onclick="ADM.qnrBlockDel(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\')">×</button>' +
    '</div>';
    var labelField = '<input class="inp" value="' + esc(b.label || '') + '" placeholder="' + (isStat ? (b.type === 'title' ? 'Titre de la section' : 'Votre texte / consigne') : 'Intitulé de la question') + '" style="width:100%;box-sizing:border-box;font-weight:' + (isStat ? '600' : '500') + '" onchange="ADM.qnrBlockSet(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',\'label\',this.value)">';
    var extra = '';
    if (!isStat) {
      extra += '<input class="inp" value="' + esc(b.help || '') + '" placeholder="Aide / précision (optionnel)" style="width:100%;box-sizing:border-box;font-size:12.5px;margin-top:6px" onchange="ADM.qnrBlockSet(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',\'help\',this.value)">';
      if (qnrHasOptions(b.type)) {
        extra += '<textarea class="inp" placeholder="Une option par ligne" style="width:100%;box-sizing:border-box;min-height:70px;resize:vertical;font-size:13px;margin-top:6px" onchange="ADM.qnrBlockOptions(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',this.value)">' + esc((b.options || []).join('\n')) + '</textarea>';
        if (b.type !== 'ranking') extra += '<label class="checkbox" style="margin-top:6px;font-size:13px"><input type="checkbox"' + (b.allowOther ? ' checked' : '') + ' onchange="ADM.qnrBlockSet(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',\'allowOther\',this.checked)"> Autoriser une réponse « Autre » (champ libre)</label>';
      }
      if (b.type === 'rating' || b.type === 'slider') {
        extra += '<div class="row" style="gap:8px;align-items:center;margin-top:6px"><span class="micro">Maximum</span><input class="inp" type="number" min="2" max="' + (b.type === 'slider' ? '100' : '10') + '" value="' + (b.max || (b.type === 'slider' ? 10 : 5)) + '" style="width:80px" onchange="ADM.qnrBlockSet(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',\'max\',parseInt(this.value,10)||0)"></div>';
      }
      extra += '<label class="checkbox" style="margin-top:8px;font-size:13px"><input type="checkbox"' + (b.required ? ' checked' : '') + ' onchange="ADM.qnrBlockSet(\'' + t.id + '\',\'' + s.id + '\',\'' + b.id + '\',\'required\',this.checked)"> Réponse obligatoire</label>';
    }
    return '<div style="background:var(--bg,#faf7f1);border:1px solid var(--bone-d);border-radius:10px;padding:11px 12px;margin-bottom:9px">' + head + labelField + extra + '</div>';
  }
  function qnrStepAdd(id) { var t = qnrTpl(id); if (!t) return; if (!Array.isArray(t.steps)) t.steps = []; t.steps.push({ id: qnrId('s'), title: '', help: '', blocks: [] }); qnrSave(); renderQnrDrawer(); renderQnrBody(); }
  // Action rapide : toutes les questions obligatoires + réponse « Autre » sur
  // toutes les questions à choix.
  function qnrBulkRequire(id) {
    var t = qnrTpl(id); if (!t) return; var n = 0;
    (t.steps || []).forEach(function (s) { (s.blocks || []).forEach(function (b) {
      if (!qnrIsStatic(b.type)) { b.required = true; n++; }
      if (qnrHasOptions(b.type) && b.type !== 'ranking') b.allowOther = true;
    }); });
    qnrSave(); renderQnrDrawer(); renderQnrBody();
    toast(n + ' question' + (n > 1 ? 's' : '') + ' rendue' + (n > 1 ? 's' : '') + ' obligatoire' + (n > 1 ? 's' : '') + ' · « Autre » activé');
  }
  function qnrStepSet(id, sid, field, val) { var t = qnrTpl(id); if (!t) return; (t.steps || []).forEach(function (s) { if (s.id === sid) s[field] = val; }); qnrSave(); }
  function qnrStepDel(id, sid) { var t = qnrTpl(id); if (!t) return; t.steps = (t.steps || []).filter(function (s) { return s.id !== sid; }); qnrSave(); renderQnrDrawer(); renderQnrBody(); }
  function qnrStepMove(id, sid, dir) { var t = qnrTpl(id); if (!t) return; var a = t.steps || []; var i = a.findIndex(function (s) { return s.id === sid; }); if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return; var tmp = a[i]; a[i] = a[j]; a[j] = tmp; qnrSave(); renderQnrDrawer(); }
  function qnrStepOf(t, sid) { var r = null; (t.steps || []).forEach(function (s) { if (s.id === sid) r = s; }); return r; }
  function qnrBlockAdd(id, sid, type) { var t = qnrTpl(id); if (!t) return; var s = qnrStepOf(t, sid); if (!s) return; if (!Array.isArray(s.blocks)) s.blocks = []; s.blocks.push({ id: qnrId('b'), type: type, label: '', help: '', placeholder: '', required: false, options: qnrHasOptions(type) ? ['Option 1', 'Option 2'] : [], max: type === 'rating' ? 5 : (type === 'slider' ? 10 : 0) }); qnrSave(); renderQnrDrawer(); renderQnrBody(); }
  function qnrBlockSet(id, sid, bid, field, val) { var t = qnrTpl(id); if (!t) return; var s = qnrStepOf(t, sid); if (!s) return; (s.blocks || []).forEach(function (b) { if (b.id === bid) b[field] = val; }); qnrSave(); if (field === 'required' || field === 'max') { } else renderQnrBody(); }
  // Changer le type d'une question existante, en conservant son intitulé et ses
  // options. On amorce des valeurs par défaut quand le nouveau type en a besoin.
  function qnrBlockChangeType(id, sid, bid, type) {
    if (QNR_BLOCKS.map(function (x) { return x[0]; }).indexOf(type) === -1) return;
    var t = qnrTpl(id); if (!t) return; var s = qnrStepOf(t, sid); if (!s) return;
    var b = (s.blocks || []).filter(function (x) { return x.id === bid; })[0]; if (!b) return;
    b.type = type;
    if (qnrHasOptions(type) && (!Array.isArray(b.options) || !b.options.length)) b.options = ['Option 1', 'Option 2'];
    if ((type === 'rating' || type === 'slider') && !b.max) b.max = type === 'rating' ? 5 : 10;
    qnrSave(); renderQnrDrawer(); renderQnrBody();
  }
  function qnrBlockOptions(id, sid, bid, val) { var t = qnrTpl(id); if (!t) return; var s = qnrStepOf(t, sid); if (!s) return; var opts = String(val || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); (s.blocks || []).forEach(function (b) { if (b.id === bid) b.options = opts; }); qnrSave(); }
  function qnrBlockDel(id, sid, bid) { var t = qnrTpl(id); if (!t) return; var s = qnrStepOf(t, sid); if (!s) return; s.blocks = (s.blocks || []).filter(function (b) { return b.id !== bid; }); qnrSave(); renderQnrDrawer(); renderQnrBody(); }
  function qnrBlockMove(id, sid, bid, dir) { var t = qnrTpl(id); if (!t) return; var s = qnrStepOf(t, sid); if (!s) return; var a = s.blocks || []; var i = a.findIndex(function (b) { return b.id === bid; }); if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return; var tmp = a[i]; a[i] = a[j]; a[j] = tmp; qnrSave(); renderQnrDrawer(); }

  // ── Import intelligent : coller un pavé de texte → questionnaire structuré ──
  function qnrGuessType(l) {
    var s = l.toLowerCase();
    if (/e-?mail|courriel|adresse mail/.test(s)) return 'email';
    if (/t[ée]l[ée]phone|portable|mobile|num[ée]ro de t/.test(s)) return 'phone';
    if (/\bdate\b|quelle date|quel jour|deadline|[ée]ch[ée]ance/.test(s)) return 'date';
    if (/\bheure\b|quelle heure|cr[ée]neau horaire/.test(s)) return 'time';
    if (/\badresse\b|rue|ville|code postal/.test(s)) return 'address';
    if (/site web|url|lien vers|votre site|instagram|r[ée]seaux/.test(s)) return 'url';
    if (/note[rz]?\b|[ée]valu|sur 5|1 [àa] 5|sur 10|satisfaction|[ée]toiles/.test(s)) return 'rating';
    if (/budget|montant|combien|nombre|prix|co[ûu]t|tarif/.test(s)) return 'number';
    if (/d[ée]criv|expliqu|parlez|pourquoi|comment|racontez|d[ée]taill|pr[ée]cisez|d[ée]finit/.test(s)) return 'long';
    return l.length > 90 ? 'long' : 'short';
  }
  // Analyse un texte libre en étapes + blocs (titres, questions, options).
  function qnrParseText(text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n');
    var steps = [], curStep = null, curBlock = null;
    function ensureStep(title) { curStep = { id: qnrId('s'), title: title || '', help: '', blocks: [] }; steps.push(curStep); curBlock = null; }
    function pushBlock(b) { if (!curStep) ensureStep(''); curStep.blocks.push(b); }
    lines.forEach(function (raw) {
      var line = raw.trim();
      if (!line) { curBlock = null; return; }
      // Ligne d'option (puce ou a) / 1.) rattachée à la question précédente
      var om = line.match(/^([-*•·▪◦–]|\(?[a-zA-Z][\)\.]|\(?\d+[\)\.])\s+(.+)$/);
      if (om && curBlock && !qnrIsStatic(curBlock.type)) {
        // Une puce juste après une question la transforme en question à choix.
        if (!qnrHasOptions(curBlock.type)) curBlock.type = curBlock._multi ? 'multi' : 'single';
        curBlock.options.push(om[2].trim());
        return;
      }
      var isQuestion = /\?\s*$/.test(line);
      var headingLike = !isQuestion && line.length <= 64 && (
        /^(#{1,3}\s+|étape|partie|section|chapitre|bloc)\b/i.test(line) ||
        (/:\s*$/.test(line) && line.length <= 48) ||
        (line === line.toUpperCase() && /[A-ZÀ-Ÿ]/.test(line) && line.replace(/[^A-Za-zÀ-ÿ]/g, '').length >= 3)
      );
      if (headingLike) {
        var title = line.replace(/^#{1,3}\s+/, '').replace(/^(étape|partie|section|chapitre|bloc)\s*\d*\s*[:\-–]?\s*/i, '').replace(/:\s*$/, '').trim();
        ensureStep(title || line.replace(/:\s*$/, ''));
        return;
      }
      var type = qnrGuessType(line);
      var multi = /plusieurs|cochez|s[ée]lection(?:nez)?\s+plusieurs|toutes? les|qui s'appliquent/i.test(line);
      var b = { id: qnrId('b'), type: type, label: line, help: '', placeholder: '', required: false, options: [], max: type === 'rating' ? 5 : 0, _multi: multi };
      pushBlock(b); curBlock = b;
    });
    steps.forEach(function (s) { s.blocks.forEach(function (b) { if (qnrHasOptions(b.type) && !b.options.length) b.type = b._multi ? 'long' : 'long'; delete b._multi; }); });
    if (!steps.length) ensureStep('');
    return steps;
  }
  function qnrSmartImport(id) {
    var t = qnrTpl(id); if (!t) return;
    var hasContent = (t.steps || []).some(function (s) { return (s.title || '').trim() || (s.blocks || []).length; });
    var ov = document.createElement('div'); ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:600px;text-align:left">' +
      '<div class="admconfirm__title">✨ Mettre en forme un texte</div>' +
      '<div class="admconfirm__msg">Colle ton texte brut, je le transforme en questionnaire structuré. Astuce : un titre en MAJUSCULES ou finissant par « : » crée une étape ; une ligne finissant par « ? » devient une question ; des lignes à puces (- ou •) juste en dessous deviennent ses options.</div>' +
      '<textarea id="qnr-import-txt" class="inp" style="width:100%;box-sizing:border-box;min-height:220px;resize:vertical;font-size:13.5px;line-height:1.5;font-family:var(--font-micro,monospace)" placeholder="VOTRE PROJET&#10;Quel est le nom de votre entreprise ?&#10;Décrivez votre activité en quelques mots ?&#10;&#10;VOS PRÉFÉRENCES&#10;Quels styles vous attirent ? (plusieurs réponses)&#10;- Épuré&#10;- Chaleureux&#10;- Audacieux&#10;Votre budget ?&#10;Votre adresse e-mail ?"></textarea>' +
      (hasContent ? '<label class="checkbox" style="margin-top:10px;font-size:13px"><input type="checkbox" id="qnr-import-replace"> Remplacer le contenu existant (sinon, ajouté à la fin)</label>' : '') +
      '<div class="admconfirm__row" style="margin-top:14px">' +
        '<button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
        '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Analyser &amp; créer</button>' +
      '</div></div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-no]').onclick = close;
    ov.querySelector('[data-yes]').onclick = function () {
      var txt = ov.querySelector('#qnr-import-txt').value || '';
      if (!txt.trim()) { toast('Colle d\'abord un texte'); return; }
      var replaceEl = ov.querySelector('#qnr-import-replace');
      var replace = !hasContent || (replaceEl && replaceEl.checked);
      var parsed = qnrParseText(txt);
      var nQ = 0; parsed.forEach(function (s) { s.blocks.forEach(function (b) { if (!qnrIsStatic(b.type)) nQ++; }); });
      if (replace) t.steps = parsed;
      else t.steps = (t.steps || []).concat(parsed);
      close();
      qnrSave(); renderQnrDrawer(); renderQnrBody();
      toast(parsed.length + ' étape' + (parsed.length > 1 ? 's' : '') + ' · ' + nQ + ' question' + (nQ > 1 ? 's' : '') + ' créées — ajuste si besoin');
    };
    document.body.appendChild(ov);
    var ta = ov.querySelector('#qnr-import-txt'); if (ta) ta.focus();
  }

  // ── Aperçu (rendu lecture seule tel que la cliente le verra) ──
  // Glisser-classer dans l'aperçu (pointer events, souris + tactile).
  var admRankDrag = null;
  function admRankRenumber(group) { if (!group) return; var items = group.querySelectorAll('[data-admrankitem]'); for (var i = 0; i < items.length; i++) { var bn = items[i].querySelector('[data-rankn]'); if (bn) bn.textContent = (i + 1); } }
  function admRankMove(e) {
    if (!admRankDrag) return; e.preventDefault();
    var g = admRankDrag.group, d = admRankDrag.row, items = g.querySelectorAll('[data-admrankitem]');
    for (var i = 0; i < items.length; i++) { var it = items[i]; if (it === d) continue; var r = it.getBoundingClientRect(); if (e.clientY >= r.top && e.clientY <= r.bottom) { g.insertBefore(d, e.clientY > r.top + r.height / 2 ? it.nextElementSibling : it); break; } }
  }
  function admRankUp() {
    document.removeEventListener('pointermove', admRankMove); document.removeEventListener('pointerup', admRankUp); document.removeEventListener('pointercancel', admRankUp);
    if (!admRankDrag) return; admRankDrag.row.style.opacity = ''; var g = admRankDrag.group; admRankDrag = null; admRankRenumber(g);
  }
  function rankDown(e, row) {
    if (e.pointerType === 'touch' && !(e.target && e.target.closest && e.target.closest('[data-rankhandle]'))) return;
    var group = row.closest('[data-admrankgroup]'); if (!group) return;
    e.preventDefault(); admRankDrag = { row: row, group: group }; row.style.opacity = '0.55';
    document.addEventListener('pointermove', admRankMove, { passive: false }); document.addEventListener('pointerup', admRankUp); document.addEventListener('pointercancel', admRankUp);
  }
  function qnrFieldPreview(b, qnum) {
    if (b.type === 'title') return '<h3 style="margin:22px 0 4px;font-family:var(--font-display);font-style:italic">' + esc(b.label || 'Titre de section') + '</h3>';
    if (b.type === 'paragraph') return '<p style="color:var(--muted);line-height:1.5;margin:6px 0 12px">' + esc(b.label || '') + '</p>';
    var num = (typeof qnum === 'number' && qnum > 0) ? '<div class="micro" style="color:var(--terre-600);margin-bottom:7px">Question ' + qnum + '</div>' : '';
    var lab = num + '<div style="font-weight:600;font-size:15.5px;line-height:1.35">' + esc(b.label || 'Question') + (b.required ? ' <span style="color:#c44">*</span>' : '') + '</div>' + (b.help ? '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:5px">' + esc(b.help) + '</div>' : '');
    // Aperçu interactif : tu peux cocher / écrire pour tester (rien n'est enregistré).
    var f = '';
    var inpBox = 'width:100%;box-sizing:border-box;background:#fff;border:1.5px solid var(--bone-d);border-radius:10px;padding:10px 12px;font-family:inherit';
    var chip = 'display:flex;gap:9px;align-items:center;padding:10px 12px;border:1.5px solid var(--bone-d);border-radius:10px;margin-bottom:7px;background:#fff;cursor:pointer';
    if (b.type === 'long') f = '<textarea style="' + inpBox + ';min-height:70px;resize:vertical"></textarea>';
    else if (b.type === 'single' || b.type === 'multi') { var it0 = (b.type === 'single' ? 'radio' : 'checkbox'); f = (b.options || []).map(function (o) { return '<label style="' + chip + '"><input type="' + it0 + '" name="qprev_' + b.id + '"> ' + esc(o) + '</label>'; }).join(''); if (b.allowOther) f += '<label style="' + chip + '"><input type="' + it0 + '" name="qprev_' + b.id + '"> Autre : <input type="text" placeholder="champ libre" style="flex:1;background:#fff;border:1px solid var(--bone-d);border-radius:8px;padding:6px 9px;font-family:inherit"></label>'; }
    else if (b.type === 'ranking') f = '<div data-admrankgroup>' + (b.options || []).map(function (o, i) { return '<div data-admrankitem onpointerdown="ADM.rankDown(event,this)" style="display:flex;gap:11px;align-items:center;padding:10px 12px;border:1px solid var(--bone-d);border-radius:12px;margin-bottom:8px;background:#fff;user-select:none"><span data-rankn style="flex-shrink:0;width:26px;height:26px;border-radius:50%;background:var(--nuit,#1c1205);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600">' + (i + 1) + '</span><span style="flex:1">' + esc(o) + '</span><span data-rankhandle style="color:var(--muted);font-size:19px;cursor:grab;touch-action:none;padding:4px 6px">⠿</span></div>'; }).join('') + '</div><div class="micro" style="color:var(--muted);margin-top:4px;text-transform:none;letter-spacing:0">Glisser (poignée ⠿) pour classer — 1 = priorité.</div>';
    else if (b.type === 'dropdown') f = '<select style="' + inpBox + '"><option>— choisir —</option>' + (b.options || []).map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + (b.allowOther ? '<option>Autre…</option>' : '') + '</select>';
    else if (b.type === 'rating') f = '<div style="font-size:22px;color:#e0c060">' + new Array((b.max || 5) + 1).join('★') + '</div>';
    else if (b.type === 'slider') f = '<input type="range" min="0" max="' + (b.max || 10) + '" style="width:100%">';
    else if (b.type === 'file') f = '<button type="button" class="btn btn--outline btn--sm" onclick="return false">📎 Joindre un fichier</button>';
    else { var it = b.type === 'date' ? 'date' : (b.type === 'time' ? 'time' : (b.type === 'number' ? 'number' : (b.type === 'email' ? 'email' : 'text'))); f = '<input type="' + it + '" style="' + inpBox + '" placeholder="' + esc(b.placeholder || '') + '">'; }
    // Carte crème = énoncé ; réponse à l'intérieur → même hiérarchie que la cliente.
    return '<div style="background:var(--surface,#F5F2EC);border:1px solid var(--bone-d);border-radius:14px;padding:16px 18px;margin-bottom:14px">' + lab + '<div style="margin-top:14px">' + f + '</div></div>';
  }
  // Aperçu fidèle : on parcourt le questionnaire étape par étape, comme la cliente.
  var QNR_PREV_ID = null, QNR_PREV_STEP = 0, QNR_PREV_COVER = true;
  function qnrPreview(id) {
    var t = qnrTpl(id); QNR_PREV_ID = id; QNR_PREV_STEP = 0;
    // On démarre sur la page de couverture (comme la cliente).
    QNR_PREV_COVER = true;
    qnrPreviewRender();
  }
  function qnrPreviewStart() { QNR_PREV_COVER = false; qnrPreviewRender(); }
  function qnrPreviewCover() { QNR_PREV_COVER = true; qnrPreviewRender(); }
  function qnrPreviewNav(d) {
    var t = qnrTpl(QNR_PREV_ID); if (!t) return;
    var n = (t.steps || []).length;
    QNR_PREV_STEP = Math.max(0, Math.min(n - 1, QNR_PREV_STEP + d));
    qnrPreviewRender();
  }
  function qnrPreviewRender() {
    var ex = el('qnr-preview-ov'); if (ex) ex.remove();
    var t = qnrTpl(QNR_PREV_ID); if (!t) return;
    var col = t.color || '#5e3fa0';
    var steps = t.steps || [];
    if (!steps.length) steps = [{ title: '', help: '', blocks: [] }];
    var header = '<div class="between" style="margin-bottom:12px"><div class="micro" style="color:var(--muted)">Aperçu · ' + esc(t.name || '') + '</div><button class="btn btn--outline btn--sm" data-no>Fermer</button></div>';
    var body;
    if (QNR_PREV_COVER) {
      // ── Page de couverture : ce que voit la cliente à l'ouverture ──
      var nQ = 0; steps.forEach(function (st) { (st.blocks || []).forEach(function (b) { if (!qnrIsStatic(b.type)) nQ++; }); });
      var nS = steps.length;
      var desc = (t.description || '').trim();
      body =
        '<div style="height:8px;border-radius:999px;background:' + esc(col) + ';width:60px;margin-bottom:22px"></div>' +
        '<div style="font-family:var(--font-micro);font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:' + esc(col) + ';margin-bottom:10px">Questionnaire</div>' +
        '<h1 style="font-family:var(--font-display);font-style:italic;font-size:32px;line-height:1.1;margin:0 0 18px">' + esc(t.name || 'Questionnaire') + '</h1>' +
        (desc
          ? '<div style="font-size:15px;line-height:1.7;color:var(--terre-600);white-space:pre-wrap">' + esc(desc) + '</div>'
          : '<div style="font-size:15px;line-height:1.7;color:var(--terre-600)">Prends un moment pour y répondre — tes réponses sont enregistrées automatiquement, tu peux revenir quand tu veux.</div>') +
        '<div style="display:flex;align-items:center;gap:14px;margin-top:22px;font-family:var(--font-micro);font-size:11px;letter-spacing:0.05em;text-transform:uppercase;color:var(--muted)"><span>' + nS + ' étape' + (nS > 1 ? 's' : '') + '</span><span>·</span><span>' + nQ + ' question' + (nQ > 1 ? 's' : '') + '</span></div>' +
        '<button class="btn btn--sm" style="margin-top:26px;background:' + esc(col) + ';color:#fff;border-color:' + esc(col) + '" onclick="ADM.qnrPreviewStart()">Commencer →</button>';
    } else {
      if (QNR_PREV_STEP >= steps.length) QNR_PREV_STEP = steps.length - 1;
      var s = steps[QNR_PREV_STEP];
      var isFirst = QNR_PREV_STEP === 0, isLast = QNR_PREV_STEP === steps.length - 1;
      var pct = Math.round((QNR_PREV_STEP + 1) / steps.length * 100);
      var progress = '<div style="margin-bottom:18px">' +
        '<div style="display:flex;justify-content:space-between;font-family:var(--font-micro);font-size:11px;color:var(--muted);margin-bottom:6px"><span>Étape ' + (QNR_PREV_STEP + 1) + ' sur ' + steps.length + '</span><span>' + pct + '%</span></div>' +
        '<div style="height:7px;background:var(--bone-d);border-radius:999px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + esc(col) + ';transition:width .2s"></div></div></div>';
      // Rappel discret pour revoir l'intro depuis la 1re étape (comme la cliente).
      var whyBlock = isFirst
        ? '<div style="margin-bottom:16px"><button style="background:none;border:none;cursor:pointer;font-size:13px;padding:0;color:' + esc(col) + '" onclick="ADM.qnrPreviewCover()">↖ Revoir l\'introduction</button></div>'
        : '';
      var _pqn = 0;
      var fields = (s.blocks || []).map(function (b) { var n = qnrIsStatic(b.type) ? 0 : (++_pqn); return qnrFieldPreview(b, n); }).join('') || '<div class="micro muted" style="text-transform:none;letter-spacing:0">Aucune question dans cette étape.</div>';
      var nav = '<div style="display:flex;gap:10px;margin-top:18px">' +
        (!isFirst ? '<button class="btn btn--outline btn--sm" onclick="ADM.qnrPreviewNav(-1)">← Précédent</button>' : '') +
        (!isLast ? '<button class="btn btn--sm" style="flex:1;background:' + esc(col) + ';color:#fff;border-color:' + esc(col) + '" onclick="ADM.qnrPreviewNav(1)">Suivant →</button>'
                 : '<button class="btn btn--sm" style="flex:1;background:' + esc(col) + ';color:#fff;border-color:' + esc(col) + '" data-no>Fin de l\'aperçu ✓</button>') + '</div>';
      var testHint = '<div class="micro" style="color:var(--muted);text-transform:none;letter-spacing:0;margin-bottom:14px;padding:8px 11px;background:var(--card);border:1px solid var(--bone-d);border-radius:9px">Aperçu interactif — tu peux cocher et écrire pour tester, rien n\'est enregistré.</div>';
      body = progress + whyBlock + testHint +
        (s.title ? '<h2 style="margin:2px 0 4px;font-family:var(--font-display);font-style:italic">' + esc(s.title) + '</h2>' : '') +
        (s.help ? '<div style="color:var(--muted);margin-bottom:10px;white-space:pre-wrap">' + esc(s.help) + '</div>' : '') +
        fields + nav;
    }
    var ov = document.createElement('div'); ov.id = 'qnr-preview-ov'; ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:600px;max-height:88vh;overflow-y:auto;text-align:left">' +
      header + body +
    '</div>';
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelectorAll('[data-no]').forEach(function (b) { b.onclick = close; });
    document.body.appendChild(ov);
  }

  // ── Envoi / assignation à une ou plusieurs clientes ──
  function qnrAssignOpen(id) {
    var t = qnrTpl(id); if (!t) return;
    if (!t.name || !t.name.trim()) { toast('Donne d\'abord un nom au questionnaire'); qnrOpen(id); return; }
    var doOpen = function () {
      var clientRows = NAV_CLIENTS.length
        ? NAV_CLIENTS.map(function (c) { return '<label style="display:flex;gap:9px;align-items:center;padding:6px 2px;cursor:pointer"><input type="checkbox" class="qnr-asg" value="' + c.key + '" style="width:16px;height:16px"> <span>' + esc(clientName(c)) + '</span></label>'; }).join('')
        : '<div class="micro muted" style="text-transform:none;letter-spacing:0">Aucune cliente avec un espace.</div>';
      var ov = document.createElement('div'); ov.className = 'admconfirm';
      ov.innerHTML = '<div class="admconfirm__box" style="max-width:520px;text-align:left">' +
        '<div class="admconfirm__title">Envoyer « ' + esc(t.name) + ' »</div>' +
        '<div class="admconfirm__msg">Choisis la ou les clientes qui recevront ce questionnaire dans leur espace.</div>' +
        '<div style="max-height:230px;overflow-y:auto;border:1px solid var(--bone-d);border-radius:10px;padding:6px 10px;margin:6px 0 12px">' + clientRows + '</div>' +
        '<div class="row" style="gap:10px;align-items:center;margin-bottom:10px"><span class="micro">Échéance (optionnel)</span><input class="inp" id="qnr-asg-due" type="date" style="width:auto"></div>' +
        '<label class="checkbox" style="font-size:13px"><input type="checkbox" id="qnr-asg-notify" checked> Prévenir la cliente par e-mail</label>' +
        '<div class="admconfirm__row" style="margin-top:14px">' +
          '<button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
          '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Envoyer</button>' +
        '</div></div>';
      function close() { ov.remove(); }
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      ov.querySelector('[data-no]').onclick = close;
      ov.querySelector('[data-yes]').onclick = function () {
        var keys = Array.prototype.slice.call(ov.querySelectorAll('.qnr-asg:checked')).map(function (x) { return x.value; });
        if (!keys.length) { toast('Sélectionne au moins une cliente'); return; }
        var notify = ov.querySelector('#qnr-asg-notify').checked;
        var due = ov.querySelector('#qnr-asg-due').value || '';
        close();
        toast('Envoi en cours…');
        var payload = { template: t, notify: notify, dueDate: due };
        Promise.all(keys.map(function (k) { return jpost('/api/clients/' + k + '/questionnaires', payload, 'POST').then(function (r) { return r.ok; }).catch(function () { return false; }); }))
          .then(function (res) { var ok = res.filter(Boolean).length; toast(ok + ' envoi' + (ok > 1 ? 's' : '') + ' effectué' + (ok > 1 ? 's' : '') + (notify ? ' · clientes prévenues ✓' : ' (sans e-mail)')); });
      };
      document.body.appendChild(ov);
    };
    if (!NAV_CLIENTS.length) { api('/api/clients').then(function (r) { return r.json(); }).then(function (d) { NAV_CLIENTS = d.clients || []; doOpen(); }).catch(function () { doOpen(); }); }
    else doOpen();
  }

  /* ════════════════ Modèles de projets (« moteur Projet ») ════════════════
   * Scénarios réutilisables : Phases → Étapes typées (client/studio/validation)
   * → Livrables (+ quota de révisions). Même mécanique que les questionnaires :
   * liste unique en KV, instantané au moment de l'instanciation dans un espace. */
  var PRJ = [], PRJ_LOADED = false, PRJ_SEL = null, PRJ_SHOW_ARCH = false, PRJ_SEQ = 0;
  var PRJ_OFFERS = [['website', 'Site internet'], ['branding', 'Identité visuelle'], ['supports', 'Support de communication'], ['partner', 'Partenaire créative'], ['maintenance', 'Maintenance']];
  var PRJ_OFFER_PID = { website: 'website', branding: 'branding', partner: 'partner', maintenance: 'maintenance', supports: 'support-001' };
  var PRJ_STEP_TYPES = [['client', 'Action cliente', '#8267ab', 'stepClient'], ['studio', 'Travail studio', '#4a6fa5', 'stepStudio'], ['validation', 'Validation', '#3f9a6a', 'stepValid']];
  function prjId(p) { PRJ_SEQ++; return (p || 'p') + Date.now().toString(36) + PRJ_SEQ.toString(36); }
  function prjTpl(id) { for (var i = 0; i < PRJ.length; i++) if (PRJ[i].id === id) return PRJ[i]; return null; }
  function prjOfferLabel(o) { for (var i = 0; i < PRJ_OFFERS.length; i++) if (PRJ_OFFERS[i][0] === o) return PRJ_OFFERS[i][1]; return o; }
  function prjStepMeta(type) { for (var i = 0; i < PRJ_STEP_TYPES.length; i++) if (PRJ_STEP_TYPES[i][0] === type) return PRJ_STEP_TYPES[i]; return PRJ_STEP_TYPES[1]; }
  function prjCountSteps(t) { var n = 0; (t.phases || []).forEach(function (p) { n += (p.steps || []).length; }); return n; }
  function prjCountDeliv(t) { var n = 0; (t.phases || []).forEach(function (p) { n += (p.deliverables || []).length; }); return n; }

  function renderProjTpl() {
    var right = '<button class="btn btn--dark btn--sm" onclick="ADM.prjAdd()">+ Nouveau modèle</button> <button class="btn btn--outline btn--sm" onclick="ADM.prjSeed()" title="Créer les 3 scénarios prêts à l\'emploi (Site, Identité, Support)">Modèles de départ</button>';
    setMain(topbar('Modèles de projets', right, 'Un scénario = des phases, des étapes (cliente / studio / validation) et des livrables. Crée-le une fois, instancie-le dans l\'espace d\'une cliente.') + '<div class="wrap" id="prj-body"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    if (!NAV_CLIENTS.length) { api('/api/clients').then(function (r) { return r.json(); }).then(function (d) { NAV_CLIENTS = d.clients || []; }).catch(function () {}); }
    if (PRJ_LOADED) { renderPrjBody(); return; }
    api('/api/project-templates').then(function (r) { return r.json(); }).then(function (d) { PRJ = (d && d.templates) || []; PRJ_LOADED = true; renderPrjBody(); }).catch(showError);
  }
  function prjSave() { jpost('/api/project-templates', { templates: PRJ }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement'); }).catch(function () { toast('Erreur'); }); }

  function renderPrjBody() {
    var body = el('prj-body'); if (!body) return;
    var active = PRJ.filter(function (t) { return !t.archived; });
    var archived = PRJ.filter(function (t) { return t.archived; });
    var grid = active.length
      ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">' + active.map(prjCardHtml).join('') + '</div>'
      : '<div class="empty">Aucun modèle de projet. Clique sur « Modèles de départ » pour créer les 3 scénarios prêts à l\'emploi (Site, Identité, Support), ou crée le tien.</div>';
    var archBtn = archived.length ? '<button class="btn btn--outline btn--sm" style="margin-top:22px" onclick="ADM.prjToggleArch()">' + (PRJ_SHOW_ARCH ? 'Masquer' : 'Voir') + ' les archivés · ' + archived.length + '</button>' : '';
    var archGrid = (PRJ_SHOW_ARCH && archived.length) ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:14px;opacity:0.75">' + archived.map(prjCardHtml).join('') + '</div>' : '';
    body.innerHTML = grid + archBtn + archGrid;
  }
  function prjCardHtml(t) {
    var col = t.color || '#5e3fa0';
    var nP = (t.phases || []).length, nS = prjCountSteps(t), nD = prjCountDeliv(t);
    var wk = t.totalWeeks ? esc(t.totalWeeks) + ' sem. · ' : '';
    var head = (t.icon ? '<span style="font-size:18px;line-height:1">' + esc(t.icon) + '</span>' : admIcon('projtpl'));
    return '<div class="card" style="padding:0;overflow:hidden;border:1px solid var(--bone-d);border-radius:14px;display:flex;flex-direction:column">' +
      '<div style="height:6px;background:' + esc(col) + '"></div>' +
      '<div style="padding:15px 16px;flex:1;display:flex;flex-direction:column;gap:8px">' +
        '<div class="between" style="align-items:flex-start;gap:8px">' +
          '<span class="row" style="gap:8px;align-items:center;cursor:pointer" onclick="ADM.prjOpen(\'' + t.id + '\')"><span style="color:' + esc(col) + ';display:flex">' + head + '</span><strong style="font-size:15.5px;line-height:1.3">' + esc(t.name || 'Sans titre') + '</strong></span>' +
          '<span style="font-family:var(--font-micro);font-size:9.5px;text-transform:uppercase;letter-spacing:0.04em;color:#fff;background:' + esc(col) + ';padding:3px 8px;border-radius:999px;white-space:nowrap;flex-shrink:0">' + esc(prjOfferLabel(t.offer)) + '</span>' +
        '</div>' +
        '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:auto">' + wk + nP + ' phase' + (nP > 1 ? 's' : '') + ' · ' + nS + ' étape' + (nS > 1 ? 's' : '') + ' · ' + nD + ' livrable' + (nD > 1 ? 's' : '') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;padding:9px 12px;border-top:1px solid var(--bone-d);flex-wrap:wrap">' +
        '<button class="pbtn" onclick="ADM.prjOpen(\'' + t.id + '\')">Éditer</button>' +
        '<button class="pbtn pbtn--ok" onclick="ADM.prjAssignOpen(\'' + t.id + '\')">Instancier</button>' +
        '<span style="margin-left:auto;display:flex;gap:4px">' +
          '<button class="pbtn" title="Dupliquer" onclick="ADM.prjDup(\'' + t.id + '\')">⧉</button>' +
          '<button class="pbtn" title="' + (t.archived ? 'Désarchiver' : 'Archiver') + '" onclick="ADM.prjArchive(\'' + t.id + '\')">' + (t.archived ? '↩' : '🗄') + '</button>' +
          '<button class="pbtn" style="color:#c44" title="Supprimer" onclick="ADM.prjDel(\'' + t.id + '\')">×</button>' +
        '</span>' +
      '</div>' +
    '</div>';
  }
  function prjToggleArch() { PRJ_SHOW_ARCH = !PRJ_SHOW_ARCH; renderPrjBody(); }
  function prjAdd() {
    var t = { id: prjId('t'), name: '', offer: 'website', icon: '', color: '#5e3fa0', totalWeeks: 0, archived: false, phases: [{ id: prjId('ph'), title: '', help: '', steps: [], deliverables: [] }] };
    PRJ.unshift(t); prjSave(); renderPrjBody(); prjOpen(t.id);
  }
  function prjDup(id) {
    var t = prjTpl(id); if (!t) return;
    var copy = JSON.parse(JSON.stringify(t));
    copy.id = prjId('t'); copy.name = (t.name || 'Sans titre') + ' (copie)'; copy.archived = false;
    (copy.phases || []).forEach(function (p) { p.id = prjId('ph'); (p.steps || []).forEach(function (s) { s.id = prjId('st'); }); (p.deliverables || []).forEach(function (d) { d.id = prjId('dl'); }); });
    PRJ.unshift(copy); prjSave(); renderPrjBody(); toast('Modèle dupliqué');
  }
  function prjArchive(id) { var t = prjTpl(id); if (!t) return; t.archived = !t.archived; prjSave(); renderPrjBody(); }
  function prjDel(id) {
    admConfirm({ title: 'Supprimer ce modèle ?', message: 'Le modèle sera supprimé. Les projets déjà instanciés dans les espaces clientes restent intacts.', yes: 'Supprimer', no: 'Annuler', danger: true }, function () {
      PRJ = PRJ.filter(function (t) { return t.id !== id; }); if (PRJ_SEL === id) prjCloseDrawer(); prjSave(); renderPrjBody();
    });
  }
  function prjSet(id, field, val) { var t = prjTpl(id); if (!t) return; if (field === 'totalWeeks') val = parseInt(val, 10) || 0; t[field] = val; prjSave(); renderPrjBody(); if (field === 'offer' || field === 'color') renderPrjDrawer(); }

  // ── Éditeur (drawer droite) ──
  function prjOpen(id) { PRJ_SEL = id; renderPrjDrawer(); }
  function prjCloseDrawer() { PRJ_SEL = null; var d = el('prj-drawer'); if (d) d.remove(); var b = el('prj-drawer-bk'); if (b) b.remove(); }
  function renderPrjDrawer() {
    var ex = el('prj-drawer'); var keepScroll = ex ? ex.scrollTop : 0;
    if (ex) ex.remove(); var exb = el('prj-drawer-bk'); if (exb) exb.remove();
    var t = prjTpl(PRJ_SEL); if (!t) return;
    var bk = document.createElement('div'); bk.id = 'prj-drawer-bk'; bk.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.32);z-index:90'; bk.onclick = prjCloseDrawer; document.body.appendChild(bk);
    var d = document.createElement('div'); d.id = 'prj-drawer'; d.style.cssText = 'position:fixed;top:0;right:0;height:100vh;width:min(780px,97vw);background:var(--bg,#faf7f1);z-index:95;box-shadow:-20px 0 54px -18px rgba(28,18,5,0.45);overflow-y:auto';
    d.innerHTML = prjDrawerHtml(t); document.body.appendChild(d);
    if (keepScroll) d.scrollTop = keepScroll;
  }
  function prjDrawerHtml(t) {
    var col = t.color || '#5e3fa0';
    var offSel = '<select class="inp" style="width:auto" onchange="ADM.prjSet(\'' + t.id + '\',\'offer\',this.value)">' +
      PRJ_OFFERS.map(function (o) { return '<option value="' + o[0] + '"' + (t.offer === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>';
    var swatches = ['#5e3fa0', '#8267ab', '#4a6fa5', '#3f9a6a', '#c98a2b', '#b5546a'];
    var colorDots = swatches.map(function (c) { return '<button title="' + esc(c) + '" onclick="ADM.prjSet(\'' + t.id + '\',\'color\',\'' + c + '\')" style="width:22px;height:22px;border-radius:50%;background:' + c + ';border:2px solid ' + (col === c ? 'var(--terre)' : 'transparent') + ';cursor:pointer"></button>'; }).join('');
    var phasesHtml = (t.phases || []).map(function (p, i) { return prjPhaseHtml(t, p, i, (t.phases || []).length); }).join('');
    return '<div style="position:sticky;top:0;background:var(--bg,#faf7f1);z-index:4;padding:14px 22px;border-bottom:1px solid var(--bone-d);display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<button onclick="ADM.prjCloseDrawer()" class="btn btn--outline btn--sm">← Fermer</button>' +
        '<button onclick="ADM.prjAssignOpen(\'' + t.id + '\')" class="btn btn--dark btn--sm">Instancier dans un espace</button>' +
        '<span style="margin-left:auto"></span>' +
        '<button onclick="ADM.prjDel(\'' + t.id + '\')" class="btn btn--danger btn--sm">Suppr.</button>' +
      '</div>' +
      '<div style="padding:20px 24px 90px;max-width:740px">' +
        '<div class="row" style="gap:10px;align-items:center;margin-bottom:10px">' +
          '<input class="inp" value="' + esc(t.icon || '') + '" placeholder="🌐" title="Emoji (optionnel)" style="width:56px;text-align:center;font-size:18px" onchange="ADM.prjSet(\'' + t.id + '\',\'icon\',this.value)">' +
          '<input class="inp" value="' + esc(t.name || '') + '" placeholder="Nom du modèle (ex. Création de site internet)" style="flex:1;box-sizing:border-box;font-size:20px;font-weight:600" onchange="ADM.prjSet(\'' + t.id + '\',\'name\',this.value)">' +
        '</div>' +
        '<div class="row" style="gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:8px">' +
          '<span class="row" style="gap:8px;align-items:center"><span class="micro">Offre</span>' + offSel + '</span>' +
          '<span class="row" style="gap:8px;align-items:center"><span class="micro">Durée</span><input class="inp" type="number" min="0" max="104" value="' + esc(t.totalWeeks || 0) + '" style="width:70px" onchange="ADM.prjSet(\'' + t.id + '\',\'totalWeeks\',this.value)"><span class="micro" style="text-transform:none;letter-spacing:0">semaines (pour « semaine X sur Y »)</span></span>' +
        '</div>' +
        '<div class="row" style="gap:6px;align-items:center;margin-bottom:20px"><span class="micro">Couleur d\'accent</span>' + colorDots + '</div>' +
        '<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-bottom:16px;display:flex;gap:14px;flex-wrap:wrap">' +
          PRJ_STEP_TYPES.map(function (m) { return '<span class="row" style="gap:5px;align-items:center"><span style="color:' + m[2] + ';display:flex">' + admIcon(m[3]) + '</span>' + esc(m[1]) + '</span>'; }).join('') +
        '</div>' +
        '<div class="between" style="margin-bottom:12px;flex-wrap:wrap;gap:8px"><h3 style="margin:0">Phases</h3><button class="btn btn--outline btn--sm" onclick="ADM.prjPhaseAdd(\'' + t.id + '\')">+ Phase</button></div>' +
        (phasesHtml || '<div class="empty" style="margin-bottom:10px">Ajoute une phase (ex. « Stratégie », « Maquette »), puis des étapes et des livrables à l\'intérieur.</div>') +
      '</div>';
  }
  function prjPhaseHtml(t, p, i, total) {
    var stepsHtml = (p.steps || []).map(function (s) { return prjStepHtml(t, p, s); }).join('');
    var delivHtml = (p.deliverables || []).map(function (d) { return prjDelivHtml(t, p, d); }).join('');
    var up = i > 0 ? '<button class="pbtn" title="Monter" onclick="ADM.prjPhaseMove(\'' + t.id + '\',\'' + p.id + '\',-1)">↑</button>' : '';
    var down = i < total - 1 ? '<button class="pbtn" title="Descendre" onclick="ADM.prjPhaseMove(\'' + t.id + '\',\'' + p.id + '\',1)">↓</button>' : '';
    return '<div class="card" style="padding:14px;margin-bottom:14px;border:1px solid var(--bone-d);border-radius:12px;background:var(--card)">' +
      '<div class="row" style="gap:8px;align-items:center;margin-bottom:8px">' +
        '<span class="micro" style="background:var(--terre);color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + (i + 1) + '</span>' +
        '<input class="inp" value="' + esc(p.title || '') + '" placeholder="Nom de la phase (ex. Maquette page d\'accueil)" style="flex:1;font-weight:600" onchange="ADM.prjPhaseSet(\'' + t.id + '\',\'' + p.id + '\',\'title\',this.value)">' +
        up + down +
        '<button class="pbtn" style="color:#c44" title="Supprimer la phase" onclick="ADM.prjPhaseDel(\'' + t.id + '\',\'' + p.id + '\')">×</button>' +
      '</div>' +
      '<input class="inp" value="' + esc(p.help || '') + '" placeholder="Sous-titre / repère de calendrier (optionnel, ex. Sem. 3)" style="width:100%;box-sizing:border-box;font-size:13px;margin-bottom:10px" onchange="ADM.prjPhaseSet(\'' + t.id + '\',\'' + p.id + '\',\'help\',this.value)">' +
      '<div class="micro" style="margin-bottom:6px">Étapes</div>' +
      (stepsHtml || '<div class="micro muted" style="text-transform:none;letter-spacing:0;margin-bottom:6px">Aucune étape.</div>') +
      '<div class="row" style="gap:5px;flex-wrap:wrap;margin:2px 0 12px">' +
        PRJ_STEP_TYPES.map(function (m) { return '<button class="pbtn" onclick="ADM.prjStepAdd(\'' + t.id + '\',\'' + p.id + '\',\'' + m[0] + '\')"><span style="color:' + m[2] + '">+</span> ' + esc(m[1]) + '</button>'; }).join('') +
      '</div>' +
      '<div class="micro" style="margin-bottom:6px">Livrables</div>' +
      (delivHtml || '<div class="micro muted" style="text-transform:none;letter-spacing:0;margin-bottom:6px">Aucun livrable.</div>') +
      '<button class="pbtn" style="margin-top:2px" onclick="ADM.prjDelivAdd(\'' + t.id + '\',\'' + p.id + '\')">+ Livrable</button>' +
    '</div>';
  }
  function prjStepHtml(t, p, s) {
    var m = prjStepMeta(s.type);
    var typeSel = '<select class="inp" style="width:auto;font-size:12px;padding:3px 6px" onchange="ADM.prjStepSet(\'' + t.id + '\',\'' + p.id + '\',\'' + s.id + '\',\'type\',this.value)">' +
      PRJ_STEP_TYPES.map(function (x) { return '<option value="' + x[0] + '"' + (s.type === x[0] ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select>';
    return '<div class="row" style="gap:7px;align-items:center;margin-bottom:6px">' +
      '<span title="' + esc(m[1]) + '" style="color:' + m[2] + ';display:flex;flex-shrink:0">' + admIcon(m[3]) + '</span>' +
      '<input class="inp" value="' + esc(s.title || '') + '" placeholder="Intitulé de l\'étape" style="flex:1;font-size:13px" onchange="ADM.prjStepSet(\'' + t.id + '\',\'' + p.id + '\',\'' + s.id + '\',\'title\',this.value)">' +
      typeSel +
      '<input class="inp" type="number" min="0" value="' + esc(s.estMinutes || 0) + '" title="Temps estimé (min)" style="width:64px;font-size:12px" onchange="ADM.prjStepSet(\'' + t.id + '\',\'' + p.id + '\',\'' + s.id + '\',\'estMinutes\',this.value)">' +
      '<span class="micro" style="text-transform:none">min</span>' +
      '<button class="pbtn" style="color:#c44" title="Supprimer" onclick="ADM.prjStepDel(\'' + t.id + '\',\'' + p.id + '\',\'' + s.id + '\')">×</button>' +
    '</div>';
  }
  function prjDelivHtml(t, p, d) {
    return '<div class="row" style="gap:7px;align-items:center;margin-bottom:6px">' +
      '<span style="color:' + esc(t.color || '#5e3fa0') + ';display:flex;flex-shrink:0">' + admIcon('deliv') + '</span>' +
      '<input class="inp" value="' + esc(d.name || '') + '" placeholder="Nom du livrable (ex. Maquette Figma accueil)" style="flex:1;font-size:13px" onchange="ADM.prjDelivSet(\'' + t.id + '\',\'' + p.id + '\',\'' + d.id + '\',\'name\',this.value)">' +
      '<span class="micro" style="text-transform:none;letter-spacing:0">révisions</span>' +
      '<input class="inp" type="number" min="0" max="20" value="' + esc(d.revisionsIncluded || 0) + '" title="Révisions incluses" style="width:60px;font-size:12px" onchange="ADM.prjDelivSet(\'' + t.id + '\',\'' + p.id + '\',\'' + d.id + '\',\'revisionsIncluded\',this.value)">' +
      '<button class="pbtn" style="color:#c44" title="Supprimer" onclick="ADM.prjDelivDel(\'' + t.id + '\',\'' + p.id + '\',\'' + d.id + '\')">×</button>' +
    '</div>';
  }
  function prjPhaseOf(t, pid) { return (t.phases || []).filter(function (p) { return p.id === pid; })[0] || null; }
  function prjPhaseAdd(id) { var t = prjTpl(id); if (!t) return; if (!Array.isArray(t.phases)) t.phases = []; t.phases.push({ id: prjId('ph'), title: '', help: '', steps: [], deliverables: [] }); prjSave(); renderPrjDrawer(); renderPrjBody(); }
  function prjPhaseSet(id, pid, field, val) { var t = prjTpl(id); if (!t) return; var p = prjPhaseOf(t, pid); if (!p) return; p[field] = val; prjSave(); }
  function prjPhaseDel(id, pid) { var t = prjTpl(id); if (!t) return; t.phases = (t.phases || []).filter(function (p) { return p.id !== pid; }); prjSave(); renderPrjDrawer(); renderPrjBody(); }
  function prjPhaseMove(id, pid, dir) { var t = prjTpl(id); if (!t) return; var a = t.phases || []; var i = a.findIndex(function (p) { return p.id === pid; }); if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return; var tmp = a[i]; a[i] = a[j]; a[j] = tmp; prjSave(); renderPrjDrawer(); renderPrjBody(); }
  function prjStepAdd(id, pid, type) { var t = prjTpl(id); if (!t) return; var p = prjPhaseOf(t, pid); if (!p) return; if (!Array.isArray(p.steps)) p.steps = []; p.steps.push({ id: prjId('st'), title: '', type: type || 'studio', action: '', estMinutes: 0 }); prjSave(); renderPrjDrawer(); renderPrjBody(); }
  function prjStepSet(id, pid, sid, field, val) { var t = prjTpl(id); if (!t) return; var p = prjPhaseOf(t, pid); if (!p) return; if (field === 'estMinutes') val = parseInt(val, 10) || 0; (p.steps || []).forEach(function (s) { if (s.id === sid) s[field] = val; }); prjSave(); if (field === 'type') renderPrjDrawer(); }
  function prjStepDel(id, pid, sid) { var t = prjTpl(id); if (!t) return; var p = prjPhaseOf(t, pid); if (!p) return; p.steps = (p.steps || []).filter(function (s) { return s.id !== sid; }); prjSave(); renderPrjDrawer(); renderPrjBody(); }
  function prjDelivAdd(id, pid) { var t = prjTpl(id); if (!t) return; var p = prjPhaseOf(t, pid); if (!p) return; if (!Array.isArray(p.deliverables)) p.deliverables = []; p.deliverables.push({ id: prjId('dl'), name: '', revisionsIncluded: 0 }); prjSave(); renderPrjDrawer(); renderPrjBody(); }
  function prjDelivSet(id, pid, did, field, val) { var t = prjTpl(id); if (!t) return; var p = prjPhaseOf(t, pid); if (!p) return; if (field === 'revisionsIncluded') val = parseInt(val, 10) || 0; (p.deliverables || []).forEach(function (d) { if (d.id === did) d[field] = val; }); prjSave(); if (field === 'revisionsIncluded') renderPrjBody(); }
  function prjDelivDel(id, pid, did) { var t = prjTpl(id); if (!t) return; var p = prjPhaseOf(t, pid); if (!p) return; p.deliverables = (p.deliverables || []).filter(function (d) { return d.id !== did; }); prjSave(); renderPrjDrawer(); renderPrjBody(); }

  // ── Instancier un modèle dans l'espace d'une cliente ──
  function prjAssignOpen(id) {
    var t = prjTpl(id); if (!t) return;
    if (!t.name || !t.name.trim()) { toast('Donne d\'abord un nom au modèle'); prjOpen(id); return; }
    var doOpen = function () {
      var opts = NAV_CLIENTS.length
        ? NAV_CLIENTS.map(function (c) { return '<option value="' + c.key + '">' + esc(clientName(c)) + '</option>'; }).join('')
        : '';
      var ov = document.createElement('div'); ov.className = 'admconfirm';
      var pid = PRJ_OFFER_PID[t.offer] || t.offer;
      ov.innerHTML = '<div class="admconfirm__box" style="max-width:520px;text-align:left">' +
        '<div class="admconfirm__title">Instancier « ' + esc(t.name) + ' »</div>' +
        '<div class="admconfirm__msg">Le scénario sera rattaché à l\'offre <strong>' + esc(prjOfferLabel(t.offer)) + '</strong> de la cliente choisie. Un projet déjà instancié sur cette offre sera remplacé.</div>' +
        (NAV_CLIENTS.length
          ? '<div class="row" style="gap:10px;align-items:center;margin:10px 0"><span class="micro">Cliente</span><select class="inp" id="prj-asg-client" style="flex:1">' + opts + '</select></div>'
          : '<div class="micro muted" style="text-transform:none;letter-spacing:0;margin:10px 0">Aucune cliente avec un espace.</div>') +
        '<div class="admconfirm__row" style="margin-top:14px">' +
          '<button class="btn btn--outline btn--sm" data-no>Annuler</button>' +
          '<button class="btn btn--sm" data-yes style="background:var(--terre);color:#fff;border-color:var(--terre)">Instancier</button>' +
        '</div></div>';
      function close() { ov.remove(); }
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      ov.querySelector('[data-no]').onclick = close;
      ov.querySelector('[data-yes]').onclick = function () {
        var sel = ov.querySelector('#prj-asg-client');
        if (!sel || !sel.value) { toast('Sélectionne une cliente'); return; }
        var key = sel.value; close(); toast('Instanciation en cours…');
        jpost('/api/clients/' + key + '/project-template', { template: t, projectId: pid }, 'POST')
          .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, b: b }; }); })
          .then(function (res) { if (res.ok) toast('Projet instancié ✓ · offre « ' + esc(prjOfferLabel(t.offer)) + ' »'); else toast(res.b && res.b.error ? res.b.error : 'Erreur — l\'offre existe-t-elle pour cette cliente ?'); })
          .catch(function () { toast('Erreur'); });
      };
      document.body.appendChild(ov);
    };
    if (!NAV_CLIENTS.length) { api('/api/clients').then(function (r) { return r.json(); }).then(function (d) { NAV_CLIENTS = d.clients || []; doOpen(); }).catch(function () { doOpen(); }); }
    else doOpen();
  }

  // ── Modèles de départ (3 scénarios prêts à l'emploi) ──
  function prjSeed() {
    admConfirm({ title: 'Créer les modèles de départ ?', message: 'Trois scénarios prêts à l\'emploi seront ajoutés : Création de site internet, Identité visuelle, Support de communication. Tu pourras les modifier ensuite.', yes: 'Créer', no: 'Annuler' }, function () {
      prjBuildPresets().forEach(function (t) { PRJ.unshift(t); });
      prjSave(); renderPrjBody(); toast('3 modèles de départ créés');
    });
  }
  function prjMkStep(type, title, min) { return { id: prjId('st'), title: title, type: type, action: '', estMinutes: min || 0 }; }
  function prjMkDeliv(name, rev) { return { id: prjId('dl'), name: name, revisionsIncluded: rev || 0 }; }
  function prjMkPhase(title, help, steps, delivs) { return { id: prjId('ph'), title: title, help: help || '', steps: steps || [], deliverables: delivs || [] }; }
  function prjBuildPresets() {
    var site = { id: prjId('t'), name: 'Création de site internet', offer: 'website', icon: '🌐', color: '#4a6fa5', totalWeeks: 8, archived: false, phases: [
      prjMkPhase('Stratégie & contenu', 'Sem. 1–2', [prjMkStep('client', 'Répondre au questionnaire', 30), prjMkStep('studio', 'Atelier stratégie & arborescence', 90), prjMkStep('validation', 'Valider l\'arborescence', 20), prjMkStep('client', 'Livrer les textes + photos', 0)], [prjMkDeliv('Trame de contenu (Google Doc)', 0)]),
      prjMkPhase('Maquette page d\'accueil', 'Sem. 3', [prjMkStep('studio', 'Créer la maquette Figma (accueil)', 240), prjMkStep('studio', 'Envoyer la vidéo Loom explicative', 20), prjMkStep('validation', 'Valider la maquette', 30)], [prjMkDeliv('Maquette Figma — Accueil', 1)]),
      prjMkPhase('Développement WordPress', 'Sem. 4–5', [prjMkStep('studio', 'Intégration sur staging', 480), prjMkStep('studio', 'Responsive + SEO + formulaire', 240), prjMkStep('client', 'Retours via Pastel', 0), prjMkStep('validation', 'Valider les corrections', 30)], [prjMkDeliv('Site de test (staging)', 2)]),
      prjMkPhase('Livraison', 'Sem. 6', [prjMkStep('studio', 'Mise en ligne + vérifications', 120), prjMkStep('studio', 'Formation 1h', 60), prjMkStep('validation', 'Réception', 0)], [prjMkDeliv('Site en ligne', 0), prjMkDeliv('Tutoriel de prise en main', 0)]),
    ] };
    var brand = { id: prjId('t'), name: 'Identité visuelle', offer: 'branding', icon: '🎨', color: '#8267ab', totalWeeks: 0, archived: false, phases: [
      prjMkPhase('Questionnaire & stratégie', '', [prjMkStep('client', 'Répondre au questionnaire', 30), prjMkStep('studio', 'Stratégie de marque', 120), prjMkStep('validation', 'Valider la stratégie', 20)], [prjMkDeliv('Plateforme de marque', 0)]),
      prjMkPhase('Direction artistique', '', [prjMkStep('studio', 'Moodboard / pistes créatives', 180), prjMkStep('validation', 'Valider la piste créative', 20)], [prjMkDeliv('Direction artistique (moodboard)', 2)]),
      prjMkPhase('Logo', '', [prjMkStep('studio', 'Création du logo + déclinaisons', 300), prjMkStep('validation', 'Valider le logo', 30)], [prjMkDeliv('Logo + déclinaisons', 2)]),
      prjMkPhase('Charte graphique', '', [prjMkStep('studio', 'Charte (couleurs, typo, usages)', 180), prjMkStep('validation', 'Valider la charte', 20)], [prjMkDeliv('Charte graphique', 1)]),
      prjMkPhase('Livraison', '', [prjMkStep('studio', 'Exports (web + print)', 90), prjMkStep('validation', 'Réception', 0)], [prjMkDeliv('Pack de livraison (exports)', 0)]),
    ] };
    var supp = { id: prjId('t'), name: 'Support de communication', offer: 'supports', icon: '📄', color: '#c98a2b', totalWeeks: 0, archived: false, phases: [
      prjMkPhase('Brief', '', [prjMkStep('client', 'Valider le brief / les infos', 0), prjMkStep('studio', 'Préparation', 30)], []),
      prjMkPhase('Création', '', [prjMkStep('studio', 'Création de la proposition', 180), prjMkStep('validation', 'Donner ton retour', 15)], [prjMkDeliv('Support (ex. Affiche / Flyer)', 5)]),
      prjMkPhase('Révisions', '', [prjMkStep('client', 'Envoyer tes retours', 0), prjMkStep('studio', 'Corrections', 60)], []),
      prjMkPhase('Livraison', '', [prjMkStep('studio', 'Fichiers imprimeur / finaux', 30), prjMkStep('validation', 'Réception', 0)], [prjMkDeliv('Fichiers finaux', 0)]),
    ] };
    return [supp, brand, site];
  }

  /* ════════════════ Incidents (erreurs remontées par les clientes) ════════════════ */
  var INC = [];
  function renderIncidents(){
    var right = '<button class="btn btn--outline btn--sm" onclick="ADM.incSeenAll()">Tout marquer comme vu</button> <button class="btn btn--danger btn--sm" onclick="ADM.incClear()">Effacer</button>';
    setMain(topbar('Incidents', right, 'Les erreurs rencontrées par tes clientes (upload, plantage…) remontent ici, pour que tu puisses les corriger.') + '<div class="wrap" id="inc-body"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    incLoad();
  }
  function incLoad(){ api('/api/client-errors').then(function(r){ return r.json(); }).then(function(d){ INC = (d && d.errors) || []; renderIncBody(); }).catch(showError); }
  function renderIncBody(){
    var b = el('inc-body'); if (!b) return;
    if (!INC.length){ b.innerHTML = '<div class="card infocard" style="background:var(--card)"><div class="empty">Aucun incident. 🎉 Tout roule pour tes clientes.</div></div>'; return; }
    var ctxLbl = { 'upload-ticket':'Upload — ticket', 'upload-brief':'Upload — demande', 'js':'Erreur technique', 'promise':'Erreur technique' };
    b.innerHTML = '<div style="display:flex;flex-direction:column;gap:12px;max-width:820px">' + INC.map(function(e){
      var isNew = !e.seen;
      return '<div class="card" style="background:var(--card);padding:16px 18px;border:1px solid '+(isNew?'#e7c6bd':'var(--bone-d)')+'">' +
        '<div class="between" style="align-items:flex-start;gap:12px">' +
          '<div style="min-width:0">' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
              (isNew?'<span style="width:8px;height:8px;border-radius:50%;background:#9b3a2e;flex-shrink:0"></span>':'') +
              '<span style="font-weight:650;color:var(--terre);font-size:14.5px">'+esc(ctxLbl[e.context]||e.context||'Incident')+'</span>' +
              '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted)">'+esc(e.clientName||'')+'</span>' +
            '</div>' +
            '<div style="font-size:13px;color:var(--terre-600);line-height:1.5;margin-top:6px">'+esc(e.message||'')+'</div>' +
            (e.url?'<div class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);margin-top:5px;word-break:break-all">'+esc(e.url)+'</div>':'') +
          '</div>' +
          '<span class="micro" style="text-transform:none;letter-spacing:0;color:var(--muted);white-space:nowrap;flex-shrink:0">'+fmtDT(e.at)+'</span>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  }
  function incClearBadge(){ BADGE_CACHE.incidents = ''; var bx = el('nav-unread-incidents'); if (bx) bx.innerHTML = ''; }
  function incSeenAll(){ jpost('/api/client-errors', {}, 'PATCH').then(function(){ incClearBadge(); incLoad(); toast('Marqué comme vu'); }).catch(function(){ toast('Erreur'); }); }
  function incClear(){ admConfirm({ title:'Effacer tous les incidents ?', message:'La liste sera vidée définitivement.', yes:'Effacer', no:'Annuler', danger:true }, function(){ jpost('/api/client-errors', {}, 'DELETE').then(function(){ INC = []; incClearBadge(); renderIncBody(); toast('Liste vidée'); }).catch(function(){ toast('Erreur'); }); }); }

  // API publique pour les onclick
  window.ADM = {
    nav: nav, login: login, logout: logout, scan: scan, createClient: createClient, copy: copy, editToken: editToken, navClientTab: navClientTab, navToggleClient: navToggleClient,
    openClient: openClient, tab: tab, subtab: subtab, saveInfos: saveInfos, saveForfait: saveForfait, testEmail: testEmail, toggleOffer: toggleOffer, addOffer: addOffer, setBanner: setBanner, setMaintenance: setMaintenance, renameSupport: renameSupport, addSupport: addSupport, addSupportQuick: addSupportQuick, delSupport: delSupport, crAdd: crAdd, crSet: crSet, crDel: crDel, crAddVersion: crAddVersion, crAddVersionLink: crAddVersionLink, crDelVersion: crDelVersion, deleteClient: deleteClient,
    toggleTicketsSpace: toggleTicketsSpace, ticketStatus: ticketStatus, ticketDue: ticketDue, ticketTime: ticketTime, ticketDelete: ticketDelete, ticketForfait: ticketForfait, ticketProposeDate: ticketProposeDate,
    taskStatus: taskStatus, taskDelete: taskDelete, taskTime: taskTime, ptToggleContent: ptToggleContent, taskComment: taskComment, taskReview: taskReview, taskSendReview: taskSendReview, taskClearRework: taskClearRework, uploadTaskDlv: uploadTaskDlv, addDlvLink: addDlvLink, delDeliverable: delDeliverable, taskArchive: taskArchive, taskMilestone: taskMilestone, taskProposeDate: taskProposeDate, taskEditOpen: taskEditOpen, ptStart: ptStart, ptPause: ptPause, tkStart: tkStart, tkPause: tkPause, navTimerPause: navTimerPause,
    bilanRequest: bilanRequest, beneficeAdd: beneficeAdd, beneficeDel: beneficeDel,
    emailSave: emailSave, emailReset: emailReset, reglSetTab: reglSetTab, bookingSave: bookingSave, congesAdd: congesAdd, congesDel: congesDel, congesSave: congesSave, wsAdd: wsAdd, wsDel: wsDel, wsSave: wsSave, backupRun: backupRun, backupDownload: backupDownload, backupRestoreOpen: backupRestoreOpen,
    missionTypeAdd: missionTypeAdd, missionTypeDel: missionTypeDel, missionTypeSave: missionTypeSave,
    prioDone: prioDone, prioPostpone: prioPostpone, prioProposeDate: prioProposeDate, prioTicketStart: prioTicketStart, prioAddDlv: prioAddDlv, prioAddDlvLink: prioAddDlvLink, prioSendReview: prioSendReview, prioSetTime: prioSetTime, prioAddTaskTime: prioAddTaskTime, prioSetGroup: prioSetGroup, prioSetFilter: prioSetFilter, prioSetTab: prioSetTab, prioConsultQnr: prioConsultQnr, qnrDelete: qnrDelete, qnrExportPdf: qnrExportPdf, capSave: capSave, inboxTriage: inboxTriage, inboxSeen: inboxSeen, kpiSetTab: kpiSetTab, kpiExport: kpiExport, doneExport: doneExport, avisSetTab: avisSetTab, remind: remind,
    notifToggle: notifToggle, notifOpen: notifOpen, notifAck: notifAck, notifAckRework: notifAckRework, notifAckComment: notifAckComment,
    myTaskAdd: myTaskAdd, myTaskStatus: myTaskStatus, myTaskDel: myTaskDel, myTaskArchive: myTaskArchive, mtStart: mtStart, mtPause: mtPause, mtSetView: mtSetView, mtSetTag: mtSetTag, mtQuickAdd: mtQuickAdd, mtCreatePick: mtCreatePick, mtOpenAdd: mtOpenAdd, mtToggleToday: mtToggleToday, mtScrollTo: mtScrollTo, mtSetMode: mtSetMode, mtMovePick: mtMovePick, mtBulkAddOpen: mtBulkAddOpen, mtMoreDone: mtMoreDone, mtToggleAdd: mtToggleAdd, mtSubAdd: mtSubAdd, mtSubToggle: mtSubToggle, mtSubDel: mtSubDel, mtDragStart: mtDragStart, mtDragEnd: mtDragEnd, mtDragOver: mtDragOver, mtDragLeave: mtDragLeave, mtDrop: mtDrop, mtEditNote: mtEditNote, mtSaveNote: mtSaveNote, mtNoteRestore: mtNoteRestore, mtEditOpen: mtEditOpen, mtToggleRow: mtToggleRow,
    visTab: visTab, visAdd: visAdd, visSet: visSet, visSetClient: visSetClient, visOpen: visOpen, visCloseDrawer: visCloseDrawer, visPresent: visPresent, visNoteSave: visNoteSave, visDel: visDel, visStepAdd: visStepAdd, visStepSet: visStepSet, visStepDel: visStepDel, visStepMove: visStepMove, visSaveEditor: visSaveEditor, visQAdd: visQAdd, visQToggle: visQToggle, visQSet: visQSet, visQDel: visQDel, visApplyTpl: visApplyTpl, visTplAdd: visTplAdd, visTplSet: visTplSet, visTplDel: visTplDel, visTplStepAdd: visTplStepAdd, visTplStepSet: visTplStepSet, visTplStepDel: visTplStepDel, visTplStepMove: visTplStepMove, visTplQAdd: visTplQAdd, visTplQSet: visTplQSet, visTplQDel: visTplQDel, visFmt: visFmt, visEdActive: visEdActive,
    planCap: planCap, planDone: planDone, planStart: planStart, planEnd: planEnd, planLunch: planLunch, planBlockAdd: planBlockAdd, planBlockDel: planBlockDel, planTypeChange: planTypeChange, planGroupColor: planGroupColor, planGroupDel: planGroupDel, planTaskForm: planTaskForm, planTaskAdd: planTaskAdd,
    stepAdd: stepAdd, stepStatus: stepStatus, stepDelete: stepDelete, stepEditOpen: stepEditOpen,
    qnAdd: qnAdd, qnSet: qnSet, qnDel: qnDel, qnMove: qnMove, qnBulk: qnBulk, qnSetOptions: qnSetOptions, qnSetTitle: qnSetTitle, qnSetReady: qnSetReady, qnPreview: qnPreview,
    qnrAdd: qnrAdd, qnrOpen: qnrOpen, qnrCloseDrawer: qnrCloseDrawer, qnrSet: qnrSet, qnrDup: qnrDup, qnrArchive: qnrArchive, qnrDel: qnrDel, qnrToggleArch: qnrToggleArch, qnrPreview: qnrPreview, qnrPreviewNav: qnrPreviewNav, qnrPreviewStart: qnrPreviewStart, qnrPreviewCover: qnrPreviewCover, rankDown: rankDown, qnrSmartImport: qnrSmartImport, qnrAssignOpen: qnrAssignOpen, qnrStepAdd: qnrStepAdd, qnrBulkRequire: qnrBulkRequire, qnrStepSet: qnrStepSet, qnrStepDel: qnrStepDel, qnrStepMove: qnrStepMove, qnrBlockAdd: qnrBlockAdd, qnrBlockSet: qnrBlockSet, qnrBlockChangeType: qnrBlockChangeType, qnrBlockOptions: qnrBlockOptions, qnrBlockDel: qnrBlockDel, qnrBlockMove: qnrBlockMove,
    prjAdd: prjAdd, prjSeed: prjSeed, prjOpen: prjOpen, prjCloseDrawer: prjCloseDrawer, prjSet: prjSet, prjDup: prjDup, prjArchive: prjArchive, prjDel: prjDel, prjToggleArch: prjToggleArch, prjAssignOpen: prjAssignOpen, prjPhaseAdd: prjPhaseAdd, prjPhaseSet: prjPhaseSet, prjPhaseDel: prjPhaseDel, prjPhaseMove: prjPhaseMove, prjStepAdd: prjStepAdd, prjStepSet: prjStepSet, prjStepDel: prjStepDel, prjDelivAdd: prjDelivAdd, prjDelivSet: prjDelivSet, prjDelivDel: prjDelivDel,
    incSeenAll: incSeenAll, incClear: incClear,
    sendMsg: sendMsg, listDocs: listDocs, upload: upload, delDoc: delDoc, lockDoc: lockDoc,
    chatClient: chatClient, chatProject: chatProject, gsend: gsend, chatSearch: chatSearch, chatCardSearch: chatCardSearch, pinMsg: pinMsg, chatKey: chatKey, taGrow: taGrow,
    qrAdd: qrAdd, qrSet: qrSet, qrDel: qrDel, qrPick: qrPick,
  };
  boot();
})();
