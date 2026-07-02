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

  var DOMAIN_LABELS = { partner: 'Partenaire créative', website: 'Site web', branding: 'Identité visuelle' };
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
    reglages: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
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
  function startPoll() { if (_poll) return; _poll = setInterval(refreshUnread, 45000); setInterval(refreshOpenChat, 15000); }
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
  function renderShell() {
    var groups = [
      ['Mon travail', [['priorities', 'Priorités'], ['mytasks', 'Mes tâches'], ['planning', 'Calendrier'], ['done', 'Réalisé']]],
      ['Mes clients', [['clients', 'Clients'], ['chat', 'Messagerie']]],
      ['Pilotage', [['kpi', 'KPI'], ['avis', 'Avis'], ['reglages', 'Réglages']]],
    ];
    function navItemHtml(it) {
      var badgeSpan = (it[0] === 'chat' || it[0] === 'clients' || it[0] === 'priorities') ? '<span id="nav-unread-' + it[0] + '" style="margin-left:auto"></span>' : '';
      return '<button class="navitem' + ((VIEW === it[0] || (VIEW === 'client' && it[0] === 'clients') || (VIEW === 'newclient' && it[0] === 'clients')) ? ' active' : '') + '" onclick="ADM.nav(\'' + it[0] + '\')">' + admIcon(it[0]) + '<span>' + it[1] + '</span>' + badgeSpan + '</button>';
    }
    var navHtml = groups.map(function (g, gi) {
      return '<div class="navgroup__label"' + (gi ? ' style="margin-top:14px"' : '') + '>' + g[0] + '</div>' + g[1].map(navItemHtml).join('');
    }).join('');
    el('app').innerHTML =
      '<div class="shell"><aside class="side">' +
      '<div class="side__brand"><div class="side__logo" title="Seed to Bloom">' + LOGO_SVG + '</div><div class="s">Administration</div></div>' +
      '<nav class="side__nav">' + navHtml + '</nav>' +
      '<div id="nav-timer-slot">' + navTimerHtml() + '</div>' +
      '<div class="side__foot"><button class="btn btn--outline btn--block btn--sm" style="color:var(--paille);border-color:rgba(242,229,194,0.25)" onclick="ADM.logout()">Déconnexion</button></div>' +
      '</aside><div class="main" id="main"></div></div>';
    renderMain();
    refreshUnread();
  }
  function navTimerHtml() {
    var run = MT_TIMER || PT_TIMER;
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
  function navTimerPause() { if (MT_TIMER) mtPause(MT_TIMER.id, true); else if (PT_TIMER) ptPause(PT_TIMER.id, true); refreshNavTimer(); renderMain(); }
  var UNREAD = 0, REV_N = 0, NOTIF_N = 0;
  function refreshTabTitle() { NOTIF_N = UNREAD + REV_N; applyTabTitle(); }
  function refreshUnread() {
    api('/api/clients').then(function (r) { return r.json(); }).then(function (d) {
      UNREAD = (d.clients || []).reduce(function (s, c) { return s + (c.unread || 0); }, 0);
      ['chat', 'clients'].forEach(function (k) { var b = el('nav-unread-' + k); if (b) b.innerHTML = UNREAD > 0 ? badge(UNREAD) : ''; });
      refreshTabTitle();
    }).catch(function () {});
    api('/api/dashboard').then(function (r) { return r.json(); }).then(function (d) {
      REV_N = (d.revisions || []).length;
      var b = el('nav-unread-priorities'); if (b) b.innerHTML = badgeAlert(REV_N);
      refreshTabTitle();
    }).catch(function () {});
  }
  function renderMain() {
    if (VIEW === 'priorities') return renderPriorities();
    if (VIEW === 'done') return renderDone();
    if (VIEW === 'mytasks') return renderMyTasks();
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
    var items = [['types', 'Types de mission'], ['emails', 'Textes des e-mails'], ['rdv', 'Rendez-vous']];
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
  function bookingSave() {
    jpost('/api/booking-link', { link: (el('bk-link').value || '').trim() }, 'PUT').then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) toast(res.d.link ? 'Lien enregistré — bouton visible chez tes clients ✓' : 'Lien retiré, bouton masqué'); else toast((res.d && res.d.error) || 'Erreur'); })
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
  function renderPriorities() {
    setMain(topbar('Priorités', '<button class="btn btn--outline btn--sm" onclick="ADM.testEmail()">Tester l\'email</button>') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/dashboard').then(function (r) { return r.json(); }).then(function (d) { PRIO_D = d; renderPrioBody(d); }).catch(showError);
  }
  function renderPrioBody(d) {
      var right = '<button class="btn btn--outline btn--sm" onclick="ADM.testEmail()">Tester l\'email</button>';
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var SL = { todo: 'À faire', in_progress: 'En cours', review: 'À valider', waiting_client: 'Attente client', upcoming: 'À venir', done: 'Terminé' };
      function ddiff(s) { var t = new Date(s); t.setHours(0, 0, 0, 0); return Math.round((t - today) / 86400000); }
      function whenLabel(n) { return n < 0 ? ((-n) + ' j de retard') : n === 0 ? "aujourd'hui" : n === 1 ? 'demain' : ('dans ' + n + ' j'); }
      function whenCol(n) { return n < 0 ? 'var(--red)' : n === 0 ? 'var(--orange)' : 'var(--muted)'; }

      var all = (d.deadlines || []).map(function (x) { x._d = ddiff(x.dueDate); return x; });
      var mine = all.filter(function (x) { return x.status !== 'waiting_client'; });
      var waiting = all.filter(function (x) { return x.status === 'waiting_client'; });
      var pv = d.pendingValidation || [];

      var nLate = mine.filter(function (x) { return x._d < 0; }).length;
      var nToday = mine.filter(function (x) { return x._d === 0; }).length;
      var nWeek = mine.filter(function (x) { return x._d > 0 && x._d <= 7; }).length;
      var nWait = waiting.length + pv.length;

      function kpi(cls, n, l, tab) { return '<div class="kpi ' + cls + (n > 0 ? ' is-on' : '') + (tab ? ' kpi--clic' : '') + '"' + (tab ? ' onclick="ADM.prioSetTab(\'' + tab + '\')"' : '') + '><div class="kpi__n">' + n + '</div><div class="kpi__l">' + l + '</div></div>'; }
      var kpis = '<div class="kpis">' + kpi('kpi--late', nLate, 'En retard', 'todo') + kpi('kpi--today', nToday, "Aujourd'hui", 'todo') + kpi('kpi--week', nWeek, 'Cette semaine', 'todo') + kpi('kpi--wait', nWait, 'Attente client', 'waiting') + '</div>';

      function prow(x) {
        var iso = (x.dueDate || '').slice(0, 10);
        return '<div class="prow">' +
          '<div class="prow__date"><strong>' + fmtDate(x.dueDate) + '</strong><span style="color:' + whenCol(x._d) + '">' + whenLabel(x._d) + '</span></div>' +
          '<div class="prow__main"><div class="prow__el">' + esc(x.title) + '</div>' +
            '<div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + ' · ' + esc(x.kind) + '</div></div>' +
          (x.id ? '<div class="prow__act">' +
            (x.project === 'partner' ? '<button class="pbtn" title="Ajouter le livrable à cette tâche" onclick="ADM.prioAddDlv(\'' + x.key + '\',\'' + x.id + '\')">+ Livrable</button>' : '') +
            '<button class="pbtn pbtn--ok" title="Marquer fait" onclick="ADM.prioDone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\')">Fait</button>' +
            '<button class="pbtn" title="Reporter à une autre date" onclick="ADM.prioPostpone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\',\'' + iso + '\')">Reporter</button>' +
          '</div>' : '<div>' + pill(x.status, SL[x.status] || x.status) + '</div>') +
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
        '</div>';
      var mineHtml = prioControls + (mineBody || '<div class="empty">' + (mine.length ? 'Rien ici avec ce filtre.' : 'Rien à traiter, tout est à jour.') + '</div>');

      // Focus du jour : ce qui doit bouger maintenant (retard + aujourd'hui), actions directes
      function focusRow(x) {
        var iso = (x.dueDate || '').slice(0, 10);
        var overdue = x._d < 0;
        var whenLight = overdue ? '#efb2a2' : (x._d === 0 ? '#eccd93' : 'rgba(242,229,194,0.62)');
        return '<div class="focusrow">' +
          '<div style="flex:1;min-width:0"><div style="font-weight:600;color:var(--paille);font-size:14.5px">' + esc(x.title) + '</div>' +
            '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.03em;text-transform:uppercase;color:rgba(242,229,194,0.6);margin-top:3px"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + ' · <span style="color:' + whenLight + ';font-weight:700">' + whenLabel(x._d) + '</span></div></div>' +
          (x.id ? '<div class="prow__act" style="flex-shrink:0">' +
            (x.project === 'partner' ? '<button class="pbtn" title="Ajouter le livrable" onclick="ADM.prioAddDlv(\'' + x.key + '\',\'' + x.id + '\')">+ Livrable</button>' : '') +
            '<button class="pbtn pbtn--ok" onclick="ADM.prioDone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\')">Fait</button>' +
            '<button class="pbtn" onclick="ADM.prioPostpone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\',\'' + iso + '\')">Reporter</button>' +
          '</div>' : '') +
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
        return '<div style="display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:13px;margin-bottom:9px;background:rgba(155,58,46,0.06)">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:600;color:var(--terre);font-size:14.5px">' + esc(r.name) + (r.taskTitle ? ' <span style="font-family:var(--font-micro);font-size:10px;text-transform:uppercase;letter-spacing:0.03em;color:var(--muted)">(' + esc(r.taskTitle) + ')</span>' : '') + '</div>' +
            '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.03em;text-transform:uppercase;color:var(--muted);margin-top:3px"><a href="javascript:ADM.openClient(\'' + r.key + '\')">' + esc(r.client) + '</a> · ' + esc(r.projectLabel) + (r.at ? ' · demandé le ' + fmtDate(r.at) : '') + '</div>' +
            (r.comment ? '<div style="font-family:var(--font-body);font-style:italic;font-size:13px;color:var(--terre);margin-top:6px;line-height:1.45">« ' + esc(r.comment) + ' »</div>' : '') +
          '</div>' +
          '<div class="prow__act" style="flex-shrink:0">' +
            ((r.project === 'partner' && r.taskId) ? '<button class="pbtn pbtn--ok" title="Déposer la nouvelle version" onclick="ADM.prioAddDlv(\'' + r.key + '\',\'' + r.taskId + '\')">+ Nouvelle version</button>' : '') +
            '<button class="pbtn" onclick="ADM.openClient(\'' + r.key + '\')">Ouvrir</button>' +
          '</div>' +
        '</div>';
      }
      // Relances intelligentes : on trie par ancienneté d'attente et on signale ce qui traîne
      var waitAll = waiting.map(function (x) { return { kind: 'step', x: x, since: -ddiff(x.dueDate) }; })
        .concat(pv.map(function (l) { return { kind: 'dlv', x: l, since: -ddiff(l.createdAt) }; }));
      waitAll.sort(function (a, b) { return b.since - a.since; });
      function waitRow(w) {
        var x = w.x, s = w.since;
        var flag = s >= 10 ? '#fbeae5' : (s >= 5 ? '#fbf5e6' : '');
        var ageCol = s >= 10 ? '#b5462f' : (s >= 5 ? '#b8871f' : 'var(--muted)');
        var ageLbl = s > 0 ? ('en attente depuis ' + s + ' j' + (s >= 5 ? ' · à relancer' : '')) : 'tout récent';
        var refDate = w.kind === 'step' ? x.dueDate : x.createdAt;
        var isStep = w.kind === 'step';
        var title = isStep ? esc(x.title) : (esc(x.name) + (x.taskTitle ? ' <span class="micro">(' + esc(x.taskTitle) + ')</span>' : ''));
        var kindArg = isStep ? 'step' : 'deliverable';
        var titleArg = isStep ? jsq(x.title) : jsq(x.name);
        return '<div class="prow"' + (flag ? ' style="background:' + flag + ';border-radius:9px"' : '') + '>' +
          '<div class="prow__date"><strong>' + fmtDate(refDate) + '</strong><span style="color:' + ageCol + ';font-weight:600">' + ageLbl + '</span></div>' +
          '<div class="prow__main"><div class="prow__el">' + title + '</div><div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + '</div></div>' +
          '<div class="prow__act">' + pill(isStep ? 'waiting_client' : 'a_valider', isStep ? 'Étape' : 'Livrable') + '<button class="pbtn" title="Envoyer un rappel par mail" onclick="ADM.remind(\'' + x.key + '\',\'' + kindArg + '\',\'' + titleArg + '\',\'' + jsq(x.projectLabel) + '\')">Relancer</button></div></div>';
      }
      var waitHtml = waitAll.map(waitRow).join('');

      var forf = (d.forfaits || []).map(function (f) {
        var pct = f.base > 0 ? Math.min(100, Math.round(f.used / f.base * 100)) : 0;
        var over = f.remaining < 0;
        return '<div class="prow" style="display:block;padding:11px 4px"><div class="between"><strong style="font-size:14px"><a href="javascript:ADM.openClient(\'' + f.key + '\')">' + esc(f.client) + '</a></strong>' +
          '<span class="micro" style="color:' + (over ? 'var(--red)' : 'var(--muted)') + '">' + (f.configured ? (f.used + ' / ' + f.base + ' h') : 'non défini') + '</span></div>' +
          (f.configured ? '<div class="bar' + (over ? ' over' : '') + '" style="margin-top:7px"><span style="width:' + pct + '%"></span></div>' : '') +
          '</div>';
      }).join('');

      // Météo de la semaine : nombre d'échéances par jour (5 prochains jours ouvrés) pour anticiper la charge
      var weekLoad = [];
      var cursor = new Date(today);
      while (weekLoad.length < 5) {
        var dow = cursor.getDay();
        if (dow !== 0 && dow !== 6) {
          var iso = cursor.getFullYear() + '-' + ('0' + (cursor.getMonth() + 1)).slice(-2) + '-' + ('0' + cursor.getDate()).slice(-2);
          var cnt = mine.filter(function (x) { return (x.dueDate || '').slice(0, 10) === iso; }).length;
          var isToday = weekLoad.length === 0 && cursor.getTime() === today.getTime();
          weekLoad.push({ count: cnt, label: isToday ? 'Auj.' : cursor.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '') });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      var maxLoad = Math.max.apply(null, weekLoad.map(function (w) { return w.count; })) || 1;
      var meteo = '<div class="card infocard"><h3><span class="infocard__dot" style="background:#5e3fa0"></span>Météo de la semaine</h3>' +
        '<div class="micro mb">Tes échéances par jour, pour anticiper les journées chargées.</div>' +
        '<div style="display:flex;align-items:flex-end;gap:10px;padding-top:6px">' +
        weekLoad.map(function (w) {
          var barH = w.count ? Math.max(Math.round(w.count / maxLoad * 60), 8) : 3;
          var heavy = w.count >= 4;
          var col = heavy ? '#a23c28' : (w.count ? '#5e3fa0' : 'var(--bone-d)');
          return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px">' +
            '<div style="font-family:var(--font-micro);font-size:12px;font-weight:700;color:' + (heavy ? '#a23c28' : 'var(--terre)') + '">' + (w.count || '·') + '</div>' +
            '<div style="width:100%;height:' + barH + 'px;border-radius:5px 5px 0 0;background:' + col + '"></div>' +
            '<div style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted)">' + esc(w.label) + '</div>' +
          '</div>';
        }).join('') +
        '</div></div>';

      // ── Onglets : on segmente la page (plus de long scroll) ──
      var tabDefs = [['todo', 'À faire', mine.length, false], ['waiting', 'Attente client', nWait, false]];
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
      } else if (PRIO_TAB === 'revisions') {
        tabBody = '<div class="card"><h3 style="color:#a23c28">Révisions demandées</h3>' +
          '<div class="micro mb" style="text-transform:none;letter-spacing:0;color:var(--muted)">Le client a demandé une révision. Déposez la nouvelle version pour repasser le livrable en « à valider ».</div>' +
          (revs.map(revRow).join('') || '<div class="empty">Aucune révision en attente.</div>') + '</div>';
      } else if (PRIO_TAB === 'load') {
        tabBody = '<div class="pcols">' + meteo +
          '<div class="card infocard" style="background:var(--card)"><h3>Forfaits du mois</h3>' +
            (forf || '<div class="empty">Aucun forfait partenaire.</div>') + '</div></div>';
      } else {
        tabBody = '<div class="card infocard" style="background:var(--card)"><h3>Ce que tu as à faire</h3>' +
          (mineHtml || '<div class="empty">Rien à traiter, tout est à jour.</div>') + '</div>';
      }

      setMain(topbar('Priorités', right, 'Ce qui compte aujourd\'hui, tous clients confondus') + '<div class="wrap">' +
        focusBand + kpis + tabBar + '<div id="priobody">' + tabBody + '</div></div>');
  }

  /* ── Mes tâches (perso admin) + timer ── */
  var MT_TIMER = null, MT_INT = null, MT_TASKS = [], MT_VIEW = 'board', MT_ADDOPEN = false, MT_TAG = 'all', MT_CLIENTS = [], MT_DONE_LIMIT = 40;
  function mtMoreDone() { MT_DONE_LIMIT += 40; renderMyTasks(); }
  var MT_TAG_COLORS = [['#f2ebff', '#5e3fa0'], ['#eaf1fb', '#35608f'], ['#f6ecd5', '#9c6f18'], ['#eaf1e6', '#4f6a46'], ['#f7ece7', '#a23c28'], ['#efe7d7', '#6b533b']];
  function mtTagColor(name) { var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return MT_TAG_COLORS[h % MT_TAG_COLORS.length]; }
  function mtTagPill(tg) { var c = mtTagColor(tg); return '<span style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:' + c[0] + ';color:' + c[1] + '">' + esc(tg) + '</span>'; }
  function mtCard(t) {
    var est = t.estMinutes ? ('estimé ' + (t.estMinutes / 60).toFixed(1).replace('.0', '') + ' h') : '';
    var dn = t.status === 'done';
    var running = MT_TIMER && MT_TIMER.id === t.id;
    var spent = t.timeSpentSeconds || 0;
    var tcColor = running ? 'var(--green)' : (spent ? 'var(--terre)' : '#c3b9a6');
    var td = new Date(); td.setHours(0, 0, 0, 0);
    var overdue = !dn && t.dueDate && new Date(t.dueDate) < td;
    var dueLbl = t.dueDate ? ((overdue ? 'en retard · ' : 'échéance ') + fmtDate(t.dueDate)) : '';
    var meta = [est, dueLbl].filter(Boolean).join(' · ');
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
    if (t.clientName) chips += '<span onclick="ADM.openClient(\'' + esc(t.clientKey) + '\')" title="Ouvrir la fiche client" style="cursor:pointer;font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:var(--terre);color:var(--paille)">' + esc(t.clientName) + '</span>';
    if (recLbl) chips += '<span title="Tâche récurrente" style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:var(--surface-2);color:var(--terre-600)">↻ ' + recLbl + '</span>';
    var chipsHtml = (chips || (Array.isArray(t.tags) && t.tags.length)) ? '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:7px">' + chips + ((Array.isArray(t.tags) && t.tags.length) ? t.tags.map(mtTagPill).join('') : '') + '</div>' : '';
    return '<div' + (canDrag ? ' draggable="true" ondragstart="ADM.mtDragStart(event,\'' + t.id + '\')" ondragend="ADM.mtDragEnd(event)"' : '') + ' style="background:var(--card);border-radius:13px;padding:14px 15px;margin-bottom:10px;box-shadow:0 3px 12px -8px rgba(28,18,5,0.28)' + (canDrag ? ';cursor:grab' : '') + '">' +
      '<div style="font-size:14.5px;font-weight:500;line-height:1.35;color:' + (dn ? 'var(--muted)' : 'var(--terre)') + (dn ? ';text-decoration:line-through' : '') + '">' + esc(t.title) + '</div>' +
      (meta ? '<div class="micro" style="margin-top:4px;color:' + (overdue ? '#a23c28' : 'var(--muted)') + '">' + meta + '</div>' : '') +
      chipsHtml +
      '<div id="mt-note-' + t.id + '" style="margin-top:5px">' + mtNoteInner(t) + '</div>' +
      subsHtml + subAdd +
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
    jpost('/api/admin/tasks', { title: text, priority: prio, tags: tags }).then(function (r) { if (r.ok) { inp.value = ''; toast('Tâche ajoutée'); renderMyTasks(); } else toast('Erreur'); });
  }
  function mtToggleAdd() { MT_ADDOPEN = !MT_ADDOPEN; renderMyTasks(); }
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
  function applyTabTitle() { if (typeof document === 'undefined') return; if (MT_TIMER || PT_TIMER) return; var b = baseTitle(); document.title = NOTIF_N > 0 ? '(' + NOTIF_N + ') ' + b : b; }
  function tabTimerOn(clock, label) { if (typeof document === 'undefined') return; baseTitle(); document.title = '▶ ' + clock + ' · ' + (label || 'tâche en cours'); }
  function tabTimerOff() { applyTabTitle(); }
  function ptBase(t) { return t.timeSpentSeconds || (t.timeSpentMinutes || 0) * 60; }
  function ptStart(id) {
    if (PT_TIMER && PT_TIMER.id !== id) ptPause(PT_TIMER.id, true);
    if (MT_TIMER) mtPause(MT_TIMER.id, true);
    var t = ptFind(id); if (!t) return;
    PT_TIMER = { id: id, startedAt: Date.now(), base: ptBase(t), title: t.title };
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
    var total = Math.round(PT_TIMER.base + (Date.now() - PT_TIMER.startedAt) / 1000);
    if (PT_INT) { clearInterval(PT_INT); PT_INT = null; }
    PT_TIMER = null;
    tabTimerOff();
    refreshNavTimer();
    // Total mis à jour localement et affiché tout de suite : pas de relecture
    // serveur (KV à cohérence différée => le chrono retombait à zéro).
    var local = ptFind(id); if (local) { local.timeSpentSeconds = total; local.timeSpentMinutes = Math.round(total / 60); }
    if (!silent && VIEW === 'client') renderClient();
    jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', timeSpentSeconds: total, timeSpentMinutes: Math.round(total / 60) }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement du temps'); });
  }
  function ptFind(id) {
    var d = (CUR && CUR.domains || []).find(function (x) { return x.id === 'partner'; });
    var ts = d && d.content && Array.isArray(d.content.taches) ? d.content.taches : [];
    return ts.find(function (x) { return x.id === id; });
  }
  function mtClock(sec) { sec = Math.round(sec); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; function p(n) { return n < 10 ? '0' + n : n; } return (h > 0 ? h + ':' : '') + p(m) + ':' + p(s); }
  function mtDur(sec) { sec = Math.round(sec); if (sec < 60) return sec + ' s'; var h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60); return (h > 0 ? h + ' h ' : '') + (m > 0 ? m + ' min' : (h > 0 ? '' : '0 min')); }
  function mtLinkify(s) {
    s = String(s == null ? '' : s);
    return s.split(/(\s+)/).map(function (tok) {
      if (/^https?:\/\//i.test(tok)) return '<a href="' + esc(tok) + '" target="_blank" rel="noopener" style="color:var(--glycine-900);text-decoration:underline;word-break:break-all">' + esc(tok) + '</a>';
      return esc(tok);
    }).join('');
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
    var tagsVal = Array.isArray(t.tags) ? t.tags.join(', ') : '';
    var ov = document.createElement('div');
    ov.className = 'admconfirm';
    ov.innerHTML = '<div class="admconfirm__box" style="max-width:520px;text-align:left">' +
      '<div class="admconfirm__title">Modifier la tâche</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">' +
        '<input class="inp" id="mte-title" value="' + esc(t.title || '') + '" placeholder="Titre">' +
        '<div class="row" style="gap:8px"><select class="inp" id="mte-prio" style="flex:1">' + prioOpts + '</select>' +
          '<input class="inp" id="mte-est" type="number" min="0" step="15" value="' + (t.estMinutes || '') + '" placeholder="min" style="width:90px" title="Durée estimée en minutes">' +
          '<input class="inp" id="mte-due" type="date" value="' + esc(t.dueDate || '') + '" style="width:auto"></div>' +
        '<div class="row" style="gap:8px"><select class="inp" id="mte-client" style="flex:1">' + cliOpts + '</select>' +
          '<select class="inp" id="mte-recur" style="flex:1">' + recOpts + '</select></div>' +
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
      var body = { title: title, priority: el('mte-prio').value, estMinutes: parseInt(el('mte-est').value, 10) || 0, dueDate: el('mte-due').value || null, clientKey: ck, clientName: cn, recurrence: el('mte-recur').value, tags: tags, notes: (el('mte-notes').value || '') };
      var tm = parseInt(el('mte-time').value, 10);
      if (!isNaN(tm) && tm >= 0 && tm * 60 !== (t.timeSpentSeconds || 0)) { body.timeSpentSeconds = tm * 60; body.forceTime = true; }
      jpost('/api/admin/tasks/' + id, body, 'PATCH').then(function (r) { if (r.ok) { close(); toast('Tâche modifiée'); renderMyTasks(); } else toast('Erreur'); });
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
        '<div class="prow__meta">' + plabel + (est ? ' · ' + est : '') + (t.dueDate ? ' · échéance ' + fmtDate(t.dueDate) : '') + '</div>' +
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
    var total = Math.round(MT_TIMER.base + (Date.now() - MT_TIMER.startedAt) / 1000);
    if (MT_INT) { clearInterval(MT_INT); MT_INT = null; }
    MT_TIMER = null;
    tabTimerOff();
    refreshNavTimer();
    // Le total est mis à jour localement et affiché tout de suite : on ne
    // relit pas le serveur (KV à cohérence différée => on revoyait zéro).
    var local = MT_TASKS.find(function (x) { return x.id === id; }); if (local) local.timeSpentSeconds = total;
    if (!silent && VIEW === 'mytasks') renderMyTasksBody();
    jpost('/api/admin/tasks/' + id, { timeSpentSeconds: total }, 'PATCH').then(function (r) { if (!r.ok) toast('Erreur d\'enregistrement du temps'); });
  }
  function renderMyTasks() {
    setMain(topbar('Mes tâches') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    Promise.all([
      api('/api/admin/tasks').then(function (r) { return r.json(); }),
      api('/api/clients').then(function (r) { return r.json(); }).catch(function () { return { clients: [] }; })
    ]).then(function (res) {
      var d = res[0];
      MT_CLIENTS = (res[1].clients || []).map(function (c) { return { key: c.key, name: (((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.entreprise || c.email || c.key) }; });
      MT_TASKS = d.tasks || [];
      renderMyTasksBody();
    }).catch(showError);
  }
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
      var form = MT_ADDOPEN ? '<div class="card"><h3>Nouvelle tâche</h3>' +
        '<div class="row"><input class="inp" id="mt-title" placeholder="Que dois-tu faire ?" style="flex:2;min-width:160px">' +
          '<select class="inp" id="mt-prio" style="width:auto"><option value="haute">Haute</option><option value="normale" selected>Normale</option><option value="basse">Basse</option></select>' +
          '<input class="inp" id="mt-est" type="number" min="0" step="15" placeholder="min" style="width:80px" title="Durée estimée en minutes">' +
          '<input class="inp" id="mt-due" type="date" style="width:auto">' +
          '<button class="btn btn--dark" onclick="ADM.myTaskAdd()">Ajouter</button></div>' +
        '<input class="inp mt" id="mt-notes" placeholder="Note ou lien (optionnel), https://… , détails…" style="width:100%;box-sizing:border-box">' +
        '<input class="inp mt" id="mt-tags" placeholder="Étiquettes séparées par des virgules (ex. Créa, Admin, Perso)" style="width:100%;box-sizing:border-box">' +
        '<div class="row mt">' +
          '<select class="inp" id="mt-client" style="flex:1;min-width:160px"><option value="">Sans client</option>' +
            MT_CLIENTS.map(function (c) { return '<option value="' + esc(c.key) + '">' + esc(c.name) + '</option>'; }).join('') + '</select>' +
          '<select class="inp" id="mt-recur" style="flex:1;min-width:160px" title="Répéter la tâche automatiquement"><option value="">Ne pas répéter</option><option value="daily">Chaque jour</option><option value="weekly">Chaque semaine</option><option value="monthly">Chaque mois</option></select>' +
        '</div>' +
        '<div class="micro mt">Durée estimée en minutes (15, 30, 60…), utile pour le calendrier et les KPI. Reliez la tâche à un client, et répétez la automatiquement une fois terminée.</div></div>' : '';
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
      var viewTabs = '<div class="subtabs"><button class="subtab' + (MT_VIEW === 'board' ? ' active' : '') + '" onclick="ADM.mtSetView(\'board\')">À faire · ' + todo.length + '</button>' +
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
      var quickBar = '<div style="margin-bottom:14px"><div style="display:flex;gap:8px">' +
        '<input class="inp" id="mt-quick" placeholder="Ajout rapide… (ex. Relancer Émilie #Admin !)" style="flex:1" onkeydown="if(event.key===\'Enter\'){event.preventDefault();ADM.mtQuickAdd();}">' +
        '<button class="btn btn--dark" onclick="ADM.mtQuickAdd()">Ajouter</button></div>' +
        '<div class="micro" style="margin-top:6px">Astuce : ajoutez <b>#étiquette</b> pour classer, et un <b>!</b> pour la priorité haute. « + Nouvelle tâche » ouvre le détail (client, échéance, récurrence…).</div></div>';
      var boardContent = MT_VIEW === 'board' ? quickBar + (todo.length ? tagChips + boardHint + boardShown : '<div class="empty">Aucune tâche en cours. Ajoutes-en une ci-dessus.</div>') : '';
      var content = MT_VIEW === 'done' ? doneView : (MT_VIEW === 'archived' ? archView : boardContent);
      var addBtn = '<button class="btn btn--dark btn--sm" onclick="ADM.mtToggleAdd()">' + (MT_ADDOPEN ? 'Fermer' : '+ Nouvelle tâche') + '</button>';
      setMain(topbar('Mes tâches', addBtn, 'Ton organisation personnelle, séparée des espaces clients') + '<div class="wrap" style="max-width:1200px">' + kpis + form + viewTabs + content + '</div>');
  }
  function myTaskAdd() {
    var title = (el('mt-title').value || '').trim(); if (!title) { toast('Titre requis'); return; }
    var tags = (el('mt-tags') ? el('mt-tags').value : '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var ck = el('mt-client') ? el('mt-client').value : '';
    var cn = ''; if (ck) { for (var i = 0; i < MT_CLIENTS.length; i++) { if (MT_CLIENTS[i].key === ck) { cn = MT_CLIENTS[i].name; break; } } }
    jpost('/api/admin/tasks', { title: title, priority: el('mt-prio').value, estMinutes: el('mt-est').value, dueDate: el('mt-due').value || null, notes: (el('mt-notes').value || '').trim(), tags: tags, clientKey: ck, clientName: cn, recurrence: el('mt-recur') ? el('mt-recur').value : '' }).then(function (r) { if (r.ok) { toast('Tâche ajoutée'); renderMyTasks(); } else toast('Erreur'); });
  }
  function myTaskStatus(id, st) { if (st === 'done' && MT_TIMER && MT_TIMER.id === id) mtPause(id, true); jpost('/api/admin/tasks/' + id, { status: st }, 'PATCH').then(function (r) { if (r.ok) renderMyTasks(); else toast('Erreur'); }); }
  function myTaskDel(id) {
    admConfirm({ title: 'Supprimer cette tâche ?', message: 'La tâche et son temps passé seront supprimés.', yes: 'Oui, supprimer', no: 'Non', danger: true }, function () {
      api('/api/admin/tasks/' + id, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Supprimée'); renderMyTasks(); } else toast('Erreur'); });
    });
  }
  function myTaskArchive(id, val) { if (val && MT_TIMER && MT_TIMER.id === id) mtPause(id, true); jpost('/api/admin/tasks/' + id, { archived: !!val }, 'PATCH').then(function (r) { if (r.ok) { toast(val ? 'Tâche archivée' : 'Tâche restaurée'); renderMyTasks(); } else toast('Erreur'); }); }

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
        items += '<div onclick="ADM.planDone(\'' + t.id + '\')" title="' + esc(t.title) + ', clic pour marquer fait" style="position:absolute;left:3px;right:3px;top:' + top + 'px;height:' + (bh - 2) + 'px;background:' + lbg + ';border:1px solid rgba(65,47,33,0.18);border-radius:7px;padding:4px 7px;overflow:hidden;box-sizing:border-box;cursor:pointer">' +
          '<div style="display:flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:' + pcol + ';flex-shrink:0"></span><span style="font-size:11px;font-weight:700;color:' + ptx + ';line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(t.title) + '</span></div>' +
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
  function renderKpi() {
    setMain(topbar('KPI partenaire créative') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/kpi').then(function (r) { return r.json(); }).then(function (d) { KPI_D = d; renderKpiBody(d); }).catch(showError);
  }
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
    var tabDefs = [['evol', 'Évolution', null], ['clients', 'Par client', (d.byClient || []).length], ['forfaits', 'Forfaits', (d.forfaits || []).filter(function (f) { return f.configured; }).length]];
    if (!tabDefs.some(function (x) { return x[0] === KPI_TAB; })) KPI_TAB = 'evol';
    var tabBar = '<div class="tabs">' + tabDefs.map(function (x) {
      return '<button class="tab' + (KPI_TAB === x[0] ? ' active' : '') + '" onclick="ADM.kpiSetTab(\'' + x[0] + '\')">' + esc(x[1]) + (x[2] != null ? badge(x[2]) : '') + '</button>';
    }).join('') + '</div>';
    var body;
    if (KPI_TAB === 'clients') {
      body = '<div class="card"><div class="between mb"><h3 style="margin:0">Par client</h3><button class="btn btn--outline btn--sm" onclick="ADM.kpiExport()">Exporter en CSV</button></div><table><thead><tr><th>Client</th><th>Réalisées</th><th>Temps</th><th>En cours</th></tr></thead><tbody>' + clientRows + '</tbody></table></div>';
    } else if (KPI_TAB === 'forfaits') {
      body = '<div class="card"><h3>Forfaits du mois</h3>' + forf + '</div>';
    } else {
      body = '<div class="pcols">' +
        '<div class="card"><h3>Tâches réalisées par mois</h3>' + barsHtml(tItems, 'var(--glycine-900)') + '</div>' +
        '<div class="card"><h3>Temps passé par mois</h3>' + barsHtml(mItems, '#c9952f', function (v) { return v + ' h'; }) + '</div></div>';
    }
    setMain(topbar('KPI partenaire créative', '', 'Ton activité de partenaire créative, mois par mois') + '<div class="wrap">' + kpis + tabBar + '<div id="kpibody">' + body + '</div></div>');
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

  function prioUrl(key, kind, id) { return '/api/clients/' + key + (kind === 'tâche' ? '/tasks/' : '/steps/') + id; }
  function prioDone(key, project, kind, id) {
    jpost(prioUrl(key, kind, id), { projectId: project, status: 'done' }, 'PATCH').then(function (r) { if (r.ok) { toast('Marqué fait ✓'); renderPriorities(); } else toast('Erreur'); });
  }
  function prioAddDlv(key, id) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(inp);
    var cleanup = function () { if (inp.parentNode) inp.parentNode.removeChild(inp); };
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; if (!f) { cleanup(); return; }
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', 'partner'); fd.append('deliverable', '1'); fd.append('taskId', id);
      toast('Envoi du livrable…');
      api('/api/clients/' + key + '/files', { method: 'POST', body: fd }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) { cleanup(); if (res.ok) { toast('Livrable ajouté · tâche « à valider »'); renderPriorities(); } else toast((res.d && res.d.error) || 'Erreur'); })
        .catch(function () { cleanup(); toast('Erreur'); });
    };
    inp.click();
  }
  function prioPostpone(key, project, kind, id, cur) {
    var inp = document.createElement('input'); inp.type = 'date'; if (cur) inp.value = cur;
    inp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(inp);
    var cleanup = function () { if (inp.parentNode) inp.parentNode.removeChild(inp); };
    inp.onchange = function () {
      var v = inp.value; cleanup(); if (!v) return;
      var body = { projectId: project }; if (kind === 'tâche') body.dueDate = v; else body.date = v;
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
  function renderClient() {
    if (!CUR || CUR.key !== CURKEY) { setMain(topbar('Client') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>'); if (!CUR || CUR.key !== CURKEY) { loadClient(); } return; }
    var nm = ((CUR.client.prenom || '') + ' ' + (CUR.client.nom || '')).trim() || (CUR.entreprise.nom) || CUR.client.email || CUR.key;
    var tabs = [['infos', 'Infos', 0, true]];
    CUR.domains.forEach(function (dn) { tabs.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label, dn.unread || 0, dn.isActive !== false]); });
    CUR.supports.forEach(function (s) { tabs.push([s.id, s.label, s.unread || 0, s.isActive !== false]); });
    tabs.push(['documents', 'Documents', 0, true]);
    tabs.push(['bilanavis', 'Bilan & avis', 0, true]);
    var tabsHtml = tabs.map(function (t) { return '<button class="tab' + (TAB === t[0] ? ' active' : '') + '" onclick="ADM.tab(\'' + t[0] + '\')"' + (t[3] ? '' : ' title="offre inactive" style="opacity:0.55"') + '>' + esc(t[1]) + (t[3] ? '' : ' ·') + badge(t[2]) + '</button>'; }).join('');
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
  function tab(t) { TAB = t; renderClient(); }

  function findDomain(id) { var d = CUR.domains.filter(function (x) { return x.id === id; })[0]; if (d) return d; return CUR.supports.filter(function (x) { return x.id === id; })[0]; }

  function renderTab() {
    var body = el('tabbody'); if (!body) return;
    if (TAB === 'infos') return body.innerHTML = tabInfos();
    if (TAB === 'documents') return renderDocuments(body);
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
    if (cur === 'forfait') content = partnerForfait(d);
    else if (cur === 'taches') content = partnerTasks(d);
    else if (cur === 'bilan') content = bilanCard(d);
    else if (cur === 'suivi') content = suiviCard(d);
    else if (cur === 'liv') content = livrablesCard(d);
    else content = chatCard(d);
    body.innerHTML = subnav + content;
    var box = el('chat-' + d.id); if (box) box.scrollTop = box.scrollHeight;
    if (cur === 'msg' && d.unread > 0) { jpost('/api/clients/' + CURKEY + '/message/read', { projectId: d.id }, 'POST'); d.unread = 0; renderClient(); }
  }
  function sectionsFor(d) {
    var s = [];
    if (d.id === 'partner') { s.push(['forfait', 'Forfait', 0]); s.push(['taches', 'Tâches', (d.content.taches || []).length]); }
    if (d.content.suivi !== undefined) s.push(['suivi', 'Étapes', (d.content.suivi || []).length]);
    if (Array.isArray(d.content.livrables)) s.push(['liv', 'Livrables', (d.content.livrables || []).length]);
    s.push(['msg', 'Messages', d.unread || 0]);
    return s;
  }
  function subtab(domId, key) { SUBTAB[domId] = key; renderTab(); }

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
      '<div>' + offersCard() + '</div>' +
      '</div>' + danger;
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
  function supportsCard() {
    var rows = (CUR.supports || []).map(function (s) {
      var nm = (s.content && s.content.name) || '';
      return '<div class="file" style="gap:10px"><input class="inp" value="' + esc(nm) + '" placeholder="' + esc(s.label) + '" onchange="ADM.renameSupport(\'' + s.pid + '\',this.value)" style="flex:1" title="Nom du support"><button class="btn btn--danger btn--sm" onclick="ADM.delSupport(\'' + s.pid + '\')">Suppr.</button></div>';
    }).join('');
    return '<div class="card infocard" style="background:var(--card)"><h3><span class="infocard__dot" style="background:#35608f"></span>Supports de com</h3>' +
      '<div class="micro mb">Cette catégorie regroupe tous tes projets de support. Nomme-les pour t\'y retrouver (réseaux sociaux, flyers, brochure…) et ajoutes-en autant que nécessaire.</div>' +
      (rows || '<div class="empty">Aucun support pour ce client.</div>') +
      '<div class="row mt"><input class="inp" id="new-support-name" placeholder="Nom du nouveau support (ex. Réseaux sociaux)" style="flex:1"><button class="btn btn--dark btn--sm" onclick="ADM.addSupport()">+ Ajouter un support</button></div></div>';
  }
  function renameSupport(pid, name) { jpost('/api/clients/' + CURKEY + '/support/' + pid, { name: name }, 'PATCH').then(function (r) { if (r.ok) { toast('Nom enregistré'); loadClient(); } else toast('Erreur'); }); }
  function addSupport() { var name = (el('new-support-name').value || '').trim(); jpost('/api/clients/' + CURKEY + '/supports', { name: name }).then(function (r) { if (r.ok) { toast('Support ajouté'); loadClient(); } else toast('Erreur'); }); }
  function delSupport(pid) {
    admConfirm({ title: 'Supprimer ce support ?', message: 'Le support et tout son contenu (messages, étapes, livrables) seront supprimés.', yes: 'Oui, supprimer', no: 'Non', danger: true }, function () {
      api('/api/clients/' + CURKEY + '/support/' + pid, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Support supprimé'); loadClient(); } else toast('Erreur'); });
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
    }).join('') : '<div class="empty">Aucune offre. Les offres se créent via les domaines de l\'espace.</div>';
    return '<div class="card infocard" style="background:var(--card)"><h3><span class="infocard__dot" style="background:#9c6f18"></span>Offres / espaces</h3>' +
      '<div class="micro mb">Activez une offre quand le client a signé : elle devient visible dans son espace. « En préparation » indique au client que l\'offre est active mais en cours de mise en place. La couleur de bannière personnalise la card côté client.</div>' + rows + '</div>';
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
    return '<div class="card"><div class="between"><h3>Forfait</h3>' +
      '<div class="row"><input id="pf-h" class="inp" type="number" style="width:90px" value="' + (f.base || 0) + '"><span class="micro">h/mois</span>' +
      '<button class="btn btn--sm" onclick="ADM.saveForfait()">OK</button></div></div>' +
      (f.configured ? '<div class="micro mt">' + (f.used || 0) + ' h consommées ce mois · reste ' + (f.remaining) + ' h</div>' : '') + '</div>';
  }
  function partnerTasks(d) {
    var all = Array.isArray(d.content.taches) ? d.content.taches : [];
    var active = all.filter(function (t) { return !t.archived; });
    var archived = all.filter(function (t) { return t.archived; });
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
      return '<div class="card" style="background:var(--card)' + (needsAction ? ';box-shadow:var(--shadow-2)' : '') + '"><div class="between" style="align-items:flex-start"><div style="min-width:0"><strong style="display:block">' + esc(t.title) + '</strong><span style="display:inline-block;margin-top:5px;font-family:var(--font-micro);font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:' + stCol + ';background:' + stBg + ';padding:3px 9px;border-radius:999px">' + stLbl + '</span></div><span class="row" style="gap:8px;align-items:center;flex-shrink:0"><span class="micro">échéance ' + fmtDate(t.dueDate) + '</span><button class="btn btn--outline btn--sm" onclick="ADM.taskEditOpen(\'' + t.id + '\')">Modifier</button>' + archBtn + '<button class="btn btn--danger btn--sm" onclick="ADM.taskDelete(\'' + t.id + '\')">Suppr.</button></span></div>' +
        (t.content ? '<div class="muted mb mt" style="font-size:14px;white-space:pre-wrap">' + esc(t.content) + '</div>' : '<div class="mt"></div>') +
        ((Array.isArray(t.attachments) && t.attachments.length) ? '<div class="row" style="flex-wrap:wrap;gap:6px;margin-bottom:8px">' + t.attachments.map(function (a) { return '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(a.key) + '/download" target="_blank">📎 ' + esc(a.name || 'fichier') + '</a>'; }).join('') + '</div>' : '') +
        '<div class="row" style="align-items:center;gap:10px">' +
        '<select class="inp" style="width:auto" onchange="ADM.taskStatus(\'' + t.id + '\',this.value)">' + opts + '</select>' +
        chBtn + chrono +
        '</div>' +
        taskDlvBlock(d, t) +
        '<details class="mt"><summary style="cursor:pointer;font-family:var(--font-micro);font-size:10px;letter-spacing:0.07em;text-transform:uppercase;color:var(--muted);padding:5px 0">Plus d\'options</summary>' +
          '<div class="row mt" style="align-items:center;gap:10px"><span class="micro">Temps passé</span><input class="inp" type="number" style="width:80px" value="' + (t.timeSpentMinutes || 0) + '" title="ajuster les minutes" onchange="ADM.taskTime(\'' + t.id + '\',this.value)"><span class="micro">min</span></div>' +
          '<div class="row mt" style="align-items:center;gap:12px;flex-wrap:wrap">' +
            '<span class="micro">Jalons proposés</span>' +
            '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">V1 <input class="inp" type="date" style="width:auto;padding:5px 8px" value="' + esc(t.v1Date || '') + '" onchange="ADM.taskMilestone(\'' + t.id + '\',\'v1Date\',this.value)"></label>' +
            '<label class="micro" style="display:flex;align-items:center;gap:5px;text-transform:none;letter-spacing:0">V2 <input class="inp" type="date" style="width:auto;padding:5px 8px" value="' + esc(t.v2Date || '') + '" onchange="ADM.taskMilestone(\'' + t.id + '\',\'v2Date\',this.value)"></label>' +
          '</div>' +
          commentsBlock('partner', t) +
        '</details>' +
        '</div>';
    }
    var grid = active.length ? '<div class="grid grid--2" style="align-items:start">' + active.map(ptCard).join('') + '</div>' : '<div class="empty">Aucune tâche (le client les crée depuis son espace).</div>';
    var archHtml = archived.length ? '<details style="margin-top:18px"><summary style="cursor:pointer;font-family:var(--font-micro);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);padding:6px 0">Tâches archivées · ' + archived.length + '</summary><div class="grid grid--2" style="align-items:start;margin-top:12px">' + archived.map(ptCard).join('') + '</div></details>' : '';
    return grid + archHtml;
  }
  function taskArchive(id, val) { if (val && PT_TIMER && PT_TIMER.id === id) ptPause(id, true); jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', archived: !!val }, 'PATCH').then(function (r) { if (r.ok) { toast(val ? 'Tâche archivée' : 'Tâche restaurée'); loadClient(); } else toast('Erreur'); }); }
  function taskMilestone(id, field, val) { var body = { projectId: 'partner' }; body[field] = val || null; jpost('/api/clients/' + CURKEY + '/tasks/' + id, body, 'PATCH').then(function (r) { if (r.ok) { toast(val ? 'Jalon enregistré' : 'Jalon retiré'); loadClient(); } else toast('Erreur'); }); }
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
        '<button class="btn btn--danger btn--sm" onclick="ADM.delDeliverable(\'' + l.id + '\')">Retirer</button></div>';
    }).join('');
    return '<div class="mt">' +
      '<div class="micro mb"><strong>Versions du livrable</strong>' + (ls.length ? ' · ' + ls.length : '') + '</div>' +
      (rows || '<div class="micro muted">Aucun livrable rattaché.</div>') +
      '<div class="row mt"><input class="inp" type="file" id="tdf-' + t.id + '"><button class="btn btn--dark btn--sm" onclick="ADM.uploadTaskDlv(\'' + t.id + '\')">' + (ls.length ? '+ Nouvelle version' : '+ Livrable') + '</button></div>' +
      '<div class="field mt"><label>Lien de révision (pour récupérer les retours)</label><div class="row"><input id="trl-' + t.id + '" class="inp" placeholder="https://… (Figma, proofing…)" value="' + esc(t.reviewLink || '') + '"><button class="btn btn--sm" onclick="ADM.taskReview(\'' + t.id + '\')">OK</button></div></div>' +
      '</div>';
  }
  function delDeliverable(id) {
    admConfirm({ title: 'Retirer ce livrable ?', message: 'Le fichier livrable sera retiré de l\'espace du client. Cette action est définitive.', danger: true, yes: 'Oui, retirer', no: 'Non' }, function () {
      api('/api/clients/' + CURKEY + '/deliverables/' + id, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: 'partner' }) }).then(function (r) { if (r.ok) { toast('Livrable retiré'); loadClient(); } else toast('Erreur'); });
    });
  }
  function taskReview(id) {
    jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', reviewLink: (el('trl-' + id).value || '').trim() }, 'PATCH').then(function (r) { if (r.ok) { toast('Lien de révision enregistré'); loadClient(); } else toast('Erreur'); });
  }
  function uploadTaskDlv(id) {
    var inp = el('tdf-' + id); var f = inp && inp.files[0]; if (!f) { toast('Choisis un fichier'); return; }
    var fd = new FormData(); fd.append('file', f); fd.append('projectId', 'partner'); fd.append('deliverable', '1'); fd.append('taskId', id);
    toast('Envoi du livrable…');
    api('/api/clients/' + CURKEY + '/files', { method: 'POST', body: fd }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) { toast('Livrable ajouté · tâche passée « à valider »'); loadClient(); } else toast(res.d.error || 'Erreur'); })
      .catch(function () { toast('Erreur'); });
  }
  function commentsBlock(pid, t) {
    var cs = (t.comments || []).map(function (c) { return '<div class="micro" style="margin:2px 0"><strong>' + (c.author === 'cindy' ? 'Vous' : 'Client') + '</strong> · ' + esc(c.text) + '</div>'; }).join('');
    return '<div class="mt">' + cs + '<div class="row mt"><input class="inp" id="cm-' + t.id + '" placeholder="Répondre / noter l\'avancement…"><button class="btn btn--sm" onclick="ADM.taskComment(\'' + pid + '\',\'' + t.id + '\')">Envoyer</button></div></div>';
  }
  /* bilan de fin de collaboration + suivi des bénéfices */
  function bilanStars(n) { var h = ''; for (var i = 1; i <= 5; i++) { h += '<span style="font-size:20px;color:' + ((n >= i) ? '#d8a93a' : '#d9cfbe') + '">' + ((n >= i) ? '★' : '☆') + '</span>'; } return h; }
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
      '<div class="row"><textarea class="inp" id="msg-' + d.id + '" placeholder="Répondre au client…"></textarea></div>' +
      '<div class="row row--end mt"><button class="btn btn--dark btn--sm" onclick="ADM.sendMsg(\'' + d.id + '\')">Envoyer</button></div></div>';
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
    var fd = new FormData(); fd.append('file', f); fd.append('projectId', el('up-proj').value); if (el('up-liv').checked) fd.append('deliverable', '1');
    var btn = el('up-btn'); btn.disabled = true; btn.textContent = 'Envoi…';
    api('/api/clients/' + CURKEY + '/files', { method: 'POST', body: fd }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { btn.disabled = false; btn.textContent = 'Uploader'; if (res.ok) { toast('Document déposé'); el('up-file').value = ''; listDocs(); } else toast(res.d.error || 'Erreur'); })
      .catch(function () { btn.disabled = false; btn.textContent = 'Uploader'; toast('Erreur'); });
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
      '<div class="chatcompose"><textarea class="inp" id="gmsg" placeholder="Répondre au client…" onkeydown="ADM.chatKey(event)"></textarea>' +
      '<button class="btn btn--dark" onclick="ADM.gsend()">Envoyer</button></div>';
    var box2 = el('chatmsgs'); if (box2) box2.scrollTop = box2.scrollHeight;
    if (d.unread > 0) { jpost('/api/clients/' + CHAT.key + '/message/read', { projectId: pid }, 'POST'); d.unread = 0; var self = el('cp-' + CHAT.key); if (self) self.classList.remove('unread'); }
  }
  function chatKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gsend(); } }
  function chatSearch(v) { var d = findDomain(CHAT.project); var box = el('chatmsgs'); if (d && box) box.innerHTML = chatBubbles(d, v); }
  function gsend() {
    var i = el('gmsg'); var v = (i.value || '').trim(); if (!v) return;
    jpost('/api/clients/' + CHAT.key + '/message', { projectId: CHAT.project, content: v }).then(function (r) {
      if (!r.ok) { toast('Erreur'); return; }
      i.value = '';
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

  // API publique pour les onclick
  window.ADM = {
    nav: nav, login: login, logout: logout, scan: scan, createClient: createClient, copy: copy, editToken: editToken,
    openClient: openClient, tab: tab, subtab: subtab, saveInfos: saveInfos, saveForfait: saveForfait, testEmail: testEmail, toggleOffer: toggleOffer, setBanner: setBanner, setMaintenance: setMaintenance, renameSupport: renameSupport, addSupport: addSupport, delSupport: delSupport, deleteClient: deleteClient,
    taskStatus: taskStatus, taskDelete: taskDelete, taskTime: taskTime, taskComment: taskComment, taskReview: taskReview, uploadTaskDlv: uploadTaskDlv, delDeliverable: delDeliverable, taskArchive: taskArchive, taskMilestone: taskMilestone, taskEditOpen: taskEditOpen, ptStart: ptStart, ptPause: ptPause, navTimerPause: navTimerPause,
    bilanRequest: bilanRequest, beneficeAdd: beneficeAdd, beneficeDel: beneficeDel,
    emailSave: emailSave, emailReset: emailReset, reglSetTab: reglSetTab, bookingSave: bookingSave,
    missionTypeAdd: missionTypeAdd, missionTypeDel: missionTypeDel, missionTypeSave: missionTypeSave,
    prioDone: prioDone, prioPostpone: prioPostpone, prioAddDlv: prioAddDlv, prioSetGroup: prioSetGroup, prioSetFilter: prioSetFilter, prioSetTab: prioSetTab, kpiSetTab: kpiSetTab, kpiExport: kpiExport, doneExport: doneExport, avisSetTab: avisSetTab, remind: remind,
    myTaskAdd: myTaskAdd, myTaskStatus: myTaskStatus, myTaskDel: myTaskDel, myTaskArchive: myTaskArchive, mtStart: mtStart, mtPause: mtPause, mtSetView: mtSetView, mtSetTag: mtSetTag, mtQuickAdd: mtQuickAdd, mtMoreDone: mtMoreDone, mtToggleAdd: mtToggleAdd, mtSubAdd: mtSubAdd, mtSubToggle: mtSubToggle, mtSubDel: mtSubDel, mtDragStart: mtDragStart, mtDragEnd: mtDragEnd, mtDragOver: mtDragOver, mtDragLeave: mtDragLeave, mtDrop: mtDrop, mtEditNote: mtEditNote, mtSaveNote: mtSaveNote, mtNoteRestore: mtNoteRestore, mtEditOpen: mtEditOpen,
    planCap: planCap, planDone: planDone, planStart: planStart, planEnd: planEnd, planLunch: planLunch, planBlockAdd: planBlockAdd, planBlockDel: planBlockDel, planTypeChange: planTypeChange, planGroupColor: planGroupColor, planGroupDel: planGroupDel, planTaskForm: planTaskForm, planTaskAdd: planTaskAdd,
    stepAdd: stepAdd, stepStatus: stepStatus, stepDelete: stepDelete, stepEditOpen: stepEditOpen,
    sendMsg: sendMsg, listDocs: listDocs, upload: upload, delDoc: delDoc, lockDoc: lockDoc,
    chatClient: chatClient, chatProject: chatProject, gsend: gsend, chatSearch: chatSearch, chatCardSearch: chatCardSearch, pinMsg: pinMsg, chatKey: chatKey,
  };
  boot();
})();
