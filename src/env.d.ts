/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Id del formulario de Kit para el newsletter. Si falta, el formulario queda deshabilitado. */
  readonly PUBLIC_KIT_FORM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
