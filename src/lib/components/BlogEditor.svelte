<script>
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';
  import ImageResize from 'tiptap-extension-resize-image';
  import TextAlign from '@tiptap/extension-text-align';
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
  import { createLowlight, all } from 'lowlight';
  import ImagePicker from './ImagePicker.svelte';

  /** @type {any} */
  export let content = null;

  /** @type {(content: any) => void} */
  export let onChange = () => {};

  /** @type {(pattern: string) => void} */
  export let onBackgroundChange = () => {};

  /** @type {any[]} */
  export let images = [];

  /** @type {string} */
  export let backgroundPattern = '';

  /** @type {Editor | null} */
  let editor = null;

  /** @type {HTMLElement} */
  let editorElement;

  let showLinkInput = false;
  let linkUrl = '';
  let showImagePicker = false;
  let selectedImagePath = '';
  let showCodeBlockLangSelector = false;
  let codeBlockLanguage = '';
  let showBackgroundSelector = false;

  // Initialize currentBackgroundPattern from prop
  let currentBackgroundPattern = backgroundPattern;

  // Watch for changes from parent component
  $: currentBackgroundPattern = backgroundPattern;

  // Create lowlight instance with all common languages
  const lowlight = createLowlight(all);

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit.configure({
          codeBlock: false, // Disable default code block to use lowlight version
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'editor-link',
          },
        }),
        ImageResize,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
        }),
        CodeBlockLowlight.configure({
          lowlight,
          HTMLAttributes: {
            class: 'editor-code-block',
          },
        }),
      ],
      content: content,
      onUpdate: ({ editor: updatedEditor }) => {
        onChange(updatedEditor.getJSON());
        // Trigger reactive update when content changes
        editor = updatedEditor;
      },
      onSelectionUpdate: () => {
        // Trigger reactive update when selection changes
        editor = editor;
      },
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
        },
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  // Toolbar actions
  function toggleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function toggleStrike() {
    editor?.chain().focus().toggleStrike().run();
  }

  function toggleCode() {
    editor?.chain().focus().toggleCode().run();
  }

  /**
   * @param {1 | 2 | 3} level
   */
  function setHeading(level) {
    editor?.chain().focus().toggleHeading({ level }).run();
  }

  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function toggleBlockquote() {
    editor?.chain().focus().toggleBlockquote().run();
  }

  function toggleCodeBlock() {
    editor?.chain().focus().toggleCodeBlock().run();
  }

  function setHorizontalRule() {
    editor?.chain().focus().setHorizontalRule().run();
  }

  function undo() {
    editor?.chain().focus().undo().run();
  }

  function redo() {
    editor?.chain().focus().redo().run();
  }

  function openLinkDialog() {
    const previousUrl = editor?.getAttributes('link').href || '';
    linkUrl = previousUrl;
    showLinkInput = true;
  }

  function setLink() {
    if (linkUrl) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    showLinkInput = false;
    linkUrl = '';
  }

  function removeLink() {
    editor?.chain().focus().unsetLink().run();
    showLinkInput = false;
    linkUrl = '';
  }

  function openImageDialog() {
    showImagePicker = true;
  }

  /**
   * Handle image selection from ImagePicker
   * @param {string} path
   */
  function handleImageSelect(path) {
    selectedImagePath = path;
  }

  function insertImage() {
    if (selectedImagePath) {
      editor?.chain().focus().setImage({ src: selectedImagePath }).run();
    }
    showImagePicker = false;
    selectedImagePath = '';
  }

  function cancelImagePicker() {
    showImagePicker = false;
    selectedImagePath = '';
  }

  /**
   * Set text alignment
   * @param {'left' | 'center' | 'right' | 'justify'} alignment
   */
  function setAlignment(alignment) {
    editor?.chain().focus().setTextAlign(alignment).run();
  }

  function openCodeBlockLangDialog() {
    const currentLang = editor?.getAttributes('codeBlock').language || '';
    codeBlockLanguage = currentLang;
    showCodeBlockLangSelector = true;
  }

  function setCodeBlockLanguage() {
    if (codeBlockLanguage) {
      editor
        ?.chain()
        .focus()
        .updateAttributes('codeBlock', { language: codeBlockLanguage })
        .run();
    }
    showCodeBlockLangSelector = false;
    codeBlockLanguage = '';
  }

  function openBackgroundSelector() {
    showBackgroundSelector = true;
  }

  /**
   * Set background pattern
   * @param {'zigzag' | 'blocks' | 'checker' | 'crosses' | ''} pattern
   */
  function setBackgroundPattern(pattern) {
    currentBackgroundPattern = pattern;
    onBackgroundChange(pattern);
    showBackgroundSelector = false;
  }

  // Check active states for toolbar buttons
  $: isActive = {
    bold: editor?.isActive('bold') || false,
    italic: editor?.isActive('italic') || false,
    strike: editor?.isActive('strike') || false,
    code: editor?.isActive('code') || false,
    heading1: editor?.isActive('heading', { level: 1 }) || false,
    heading2: editor?.isActive('heading', { level: 2 }) || false,
    heading3: editor?.isActive('heading', { level: 3 }) || false,
    bulletList: editor?.isActive('bulletList') || false,
    orderedList: editor?.isActive('orderedList') || false,
    blockquote: editor?.isActive('blockquote') || false,
    codeBlock: editor?.isActive('codeBlock') || false,
    link: editor?.isActive('link') || false,
    alignLeft: editor?.isActive({ textAlign: 'left' }) || false,
    alignCenter: editor?.isActive({ textAlign: 'center' }) || false,
    alignRight: editor?.isActive({ textAlign: 'right' }) || false,
    alignJustify: editor?.isActive({ textAlign: 'justify' }) || false,
  };
</script>

<div class="editor-container">
  <!-- Toolbar -->
  <div class="toolbar">
    <div class="toolbar-group">
      <button
        on:click={toggleBold}
        class:active={isActive.bold}
        type="button"
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        on:click={toggleItalic}
        class:active={isActive.italic}
        type="button"
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        on:click={toggleStrike}
        class:active={isActive.strike}
        type="button"
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        on:click={toggleCode}
        class:active={isActive.code}
        type="button"
        title="Inline Code"
      >
        {'</>'}
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <button
        on:click={() => setHeading(1)}
        class:active={isActive.heading1}
        type="button"
        title="Heading 1"
      >
        H1
      </button>
      <button
        on:click={() => setHeading(2)}
        class:active={isActive.heading2}
        type="button"
        title="Heading 2"
      >
        H2
      </button>
      <button
        on:click={() => setHeading(3)}
        class:active={isActive.heading3}
        type="button"
        title="Heading 3"
      >
        H3
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <button
        on:click={toggleBulletList}
        class:active={isActive.bulletList}
        type="button"
        title="Bullet List"
      >
        •
      </button>
      <button
        on:click={toggleOrderedList}
        class:active={isActive.orderedList}
        type="button"
        title="Numbered List"
      >
        1.
      </button>
      <button
        on:click={toggleBlockquote}
        class:active={isActive.blockquote}
        type="button"
        title="Quote"
      >
        "
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <button
        on:click={() => setAlignment('left')}
        class:active={isActive.alignLeft}
        type="button"
        title="Align Left"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"
          />
        </svg>
      </button>
      <button
        on:click={() => setAlignment('center')}
        class:active={isActive.alignCenter}
        type="button"
        title="Align Center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"
          />
        </svg>
      </button>
      <button
        on:click={() => setAlignment('right')}
        class:active={isActive.alignRight}
        type="button"
        title="Align Right"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"
          />
        </svg>
      </button>
      <button
        on:click={() => setAlignment('justify')}
        class:active={isActive.alignJustify}
        type="button"
        title="Justify"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"
          />
        </svg>
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <button
        on:click={openLinkDialog}
        class:active={isActive.link}
        type="button"
        title="Link"
      >
        🔗
      </button>
      <button on:click={openImageDialog} type="button" title="Image">
        🖼️
      </button>
      <button
        on:click={toggleCodeBlock}
        class:active={isActive.codeBlock}
        type="button"
        title="Code Block"
      >
        {'{ }'}
      </button>
      <button
        on:click={setHorizontalRule}
        type="button"
        title="Horizontal Rule"
      >
        ―
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <button
        on:click={openBackgroundSelector}
        type="button"
        title="Background Pattern"
      >
        🎨
      </button>
      <button
        on:click={openCodeBlockLangDialog}
        type="button"
        title="Code Language"
        disabled={!isActive.codeBlock}
      >
        💬
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <button on:click={undo} type="button" title="Undo"> ↶ </button>
      <button on:click={redo} type="button" title="Redo"> ↷ </button>
    </div>
  </div>

  <!-- Editor -->
  <div
    class="editor {currentBackgroundPattern}"
    bind:this={editorElement}
  ></div>

  <!-- Link Dialog -->
  {#if showLinkInput}
    <div
      class="dialog-overlay"
      role="button"
      tabindex="0"
      on:click={() => (showLinkInput = false)}
      on:keydown={(e) => e.key === 'Escape' && (showLinkInput = false)}
    >
      <div
        class="dialog"
        role="dialog"
        aria-labelledby="link-dialog-title"
        tabindex="-1"
        on:click|stopPropagation
        on:keydown|stopPropagation
      >
        <h4 id="link-dialog-title">Insert Link</h4>
        <input
          type="text"
          bind:value={linkUrl}
          placeholder="https://example.com"
          on:keydown={(e) => e.key === 'Enter' && setLink()}
        />
        <div class="dialog-actions">
          <button on:click={setLink} type="button" class="button-primary">
            {linkUrl ? 'Update' : 'Insert'}
          </button>
          {#if isActive.link}
            <button on:click={removeLink} type="button" class="button-danger">
              Remove
            </button>
          {/if}
          <button
            on:click={() => (showLinkInput = false)}
            type="button"
            class="button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Image Picker Dialog -->
  {#if showImagePicker}
    <div
      class="dialog-overlay"
      role="button"
      tabindex="0"
      on:click={cancelImagePicker}
      on:keydown={(e) => e.key === 'Escape' && cancelImagePicker()}
    >
      <div
        class="dialog image-picker-dialog"
        role="dialog"
        aria-labelledby="image-picker-title"
        tabindex="-1"
        on:click|stopPropagation
        on:keydown|stopPropagation
      >
        <h4 id="image-picker-title">Insert Image</h4>
        <ImagePicker
          {images}
          selectedImage={selectedImagePath}
          onSelect={handleImageSelect}
        />
        <div class="dialog-actions">
          <button on:click={insertImage} type="button" class="button-primary">
            Insert Image
          </button>
          <button
            on:click={cancelImagePicker}
            type="button"
            class="button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Code Block Language Selector Dialog -->
  {#if showCodeBlockLangSelector}
    <div
      class="dialog-overlay"
      role="button"
      tabindex="0"
      on:click={() => (showCodeBlockLangSelector = false)}
      on:keydown={(e) =>
        e.key === 'Escape' && (showCodeBlockLangSelector = false)}
    >
      <div
        class="dialog"
        role="dialog"
        aria-labelledby="code-lang-dialog-title"
        tabindex="-1"
        on:click|stopPropagation
        on:keydown|stopPropagation
      >
        <h4 id="code-lang-dialog-title">Set Code Block Language</h4>
        <input
          type="text"
          bind:value={codeBlockLanguage}
          placeholder="javascript, python, html, css, etc."
          on:keydown={(e) => e.key === 'Enter' && setCodeBlockLanguage()}
        />
        <p class="help-text">
          Common languages: javascript, typescript, python, html, css, java,
          rust, go, bash
        </p>
        <div class="dialog-actions">
          <button
            on:click={setCodeBlockLanguage}
            type="button"
            class="button-primary"
          >
            Set Language
          </button>
          <button
            on:click={() => (showCodeBlockLangSelector = false)}
            type="button"
            class="button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Background Pattern Selector Dialog -->
  {#if showBackgroundSelector}
    <div
      class="dialog-overlay"
      role="button"
      tabindex="0"
      on:click={() => (showBackgroundSelector = false)}
      on:keydown={(e) => e.key === 'Escape' && (showBackgroundSelector = false)}
    >
      <div
        class="dialog"
        role="dialog"
        aria-labelledby="bg-pattern-dialog-title"
        tabindex="-1"
        on:click|stopPropagation
        on:keydown|stopPropagation
      >
        <h4 id="bg-pattern-dialog-title">Select Background Pattern</h4>
        <div class="bg-pattern-grid">
          <button
            type="button"
            class="bg-pattern-option blocks"
            on:click={() => setBackgroundPattern('blocks')}
          >
            <span>Blocks</span>
          </button>
          <button
            type="button"
            class="bg-pattern-option checker"
            on:click={() => setBackgroundPattern('checker')}
          >
            <span>Checker</span>
          </button>
          <button
            type="button"
            class="bg-pattern-option crosses"
            on:click={() => setBackgroundPattern('crosses')}
          >
            <span>Crosses</span>
          </button>
          <button
            type="button"
            class="bg-pattern-option zigzag"
            on:click={() => setBackgroundPattern('zigzag')}
          >
            <span>Zigzag</span>
          </button>
          <button
            type="button"
            class="bg-pattern-option none"
            on:click={() => setBackgroundPattern('')}
          >
            <span>None</span>
          </button>
        </div>
        <div class="dialog-actions">
          <button
            on:click={() => (showBackgroundSelector = false)}
            type="button"
            class="button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .editor-container {
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    overflow: hidden;
    background-color: var(--neutral-white);
  }

  .toolbar {
    display: flex;
    gap: 4px;
    padding: 8px;
    background-color: var(--neutral-dark-gray);
    border-bottom: 2px solid var(--neutral-dark-gray-op-50);
    flex-wrap: wrap;
  }

  .toolbar-group {
    display: flex;
    gap: 2px;
  }

  .toolbar-separator {
    width: 1px;
    background-color: var(--neutral-dark-gray-op-50);
    margin: 0 4px;
  }

  .toolbar button {
    padding: 6px 10px;
    background-color: var(--neutral-gray);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    color: var(--neutral-black);
    transition: background-color 0.2s;
    min-width: 32px;
  }

  .toolbar button:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  .toolbar button.active {
    background-color: var(--main-blue);
    color: var(--neutral-white);
  }

  .editor {
    min-height: 400px;
    max-height: 600px;
    overflow-y: auto;
    padding: 20px;
    background-color: var(--neutral-white);
  }

  .editor :global(.ProseMirror) {
    outline: none;
    min-height: 400px;
  }

  .editor :global(h1) {
    font-size: 2em;
    font-weight: bold;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
  }

  .editor :global(h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 0.83em;
    margin-bottom: 0.83em;
  }

  .editor :global(h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .editor :global(p) {
    margin: 1em 0;
  }

  .editor :global(ul),
  .editor :global(ol) {
    padding-left: 2em;
    margin: 1em 0;
  }

  .editor :global(li) {
    margin: 0.5em 0;
  }

  .editor :global(blockquote) {
    border-left: 4px solid var(--main-blue);
    padding-left: 1em;
    margin: 1em 0;
    font-style: italic;
    color: var(--neutral-black);
    opacity: 0.8;
  }

  .editor :global(code) {
    background-color: var(--neutral-gray);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  .editor :global(pre) {
    background-color: var(--neutral-dark-gray);
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1em 0;
  }

  .editor :global(pre code) {
    background-color: transparent;
    padding: 0;
    color: var(--neutral-black);
  }

  .editor :global(.editor-link) {
    color: var(--main-blue);
    text-decoration: underline;
    cursor: pointer;
  }

  .editor :global(.editor-image) {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin: 1em 0;
  }

  .editor :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin: 1em 0;
  }

  .editor :global(hr) {
    border: none;
    border-top: 2px solid var(--neutral-dark-gray-op-50);
    margin: 2em 0;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog {
    background-color: var(--neutral-dark-gray);
    padding: 24px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
  }

  .image-picker-dialog {
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .dialog h4 {
    margin: 0 0 16px 0;
    color: var(--main-blue-light);
  }

  .dialog input {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-gray);
    color: var(--neutral-black);
    font-size: 14px;
    margin-bottom: 16px;
    box-sizing: border-box;
  }

  .dialog input:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  .dialog-actions {
    display: flex;
    gap: 10px;
  }

  .button-primary {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.5s;
  }

  .button-primary:hover {
    background-color: var(--main-blue-alt);
  }

  .button-secondary {
    background-color: var(--neutral-gray);
    color: var(--neutral-black);
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .button-secondary:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  .button-danger {
    background-color: var(--red);
    color: var(--neutral-white);
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: background-color 0.5s;
  }

  .button-danger:hover {
    background-color: #cc0000;
  }

  .help-text {
    font-size: 0.85rem;
    color: var(--neutral-black);
    opacity: 0.7;
    margin: 0 0 16px 0;
  }

  .bg-pattern-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .bg-pattern-option {
    height: 100px;
    border-radius: 10px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    padding: 0;
  }

  .bg-pattern-option:hover {
    border-color: var(--main-blue);
    transform: scale(1.05);
  }

  .bg-pattern-option span {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--neutral-dark-gray);
    color: var(--neutral-black);
    padding: 4px 12px;
    border-radius: 5px;
    font-size: 0.85rem;
    font-weight: 500;
    z-index: 1;
  }

  .bg-pattern-option.none {
    background: var(--neutral-white);
  }

  /* Background pattern styles for preview (scaled down from 90px to 45px) */
  .bg-pattern-option.zigzag {
    background-color: var(--main-blue);
    background-image:
      linear-gradient(
        135deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25%
      ),
      linear-gradient(
        225deg,
        var(--neutral-dark-gray-op-50) 25%,
        transparent 25%
      ),
      linear-gradient(
        315deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25%
      ),
      linear-gradient(
        45deg,
        var(--neutral-dark-gray-op-50) 25%,
        transparent 25%
      );
    background-size:
      45px 45px,
      45px 45px,
      45px 45px,
      45px 45px;
    background-position:
      -22.5px 0,
      -22.5px 0,
      0 0,
      0 0;
  }

  .bg-pattern-option.blocks {
    background-image:
      linear-gradient(
        30deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        150deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        30deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        150deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        60deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25.5%,
        transparent 75%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-10)
      ),
      linear-gradient(
        60deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25.5%,
        transparent 75%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-10)
      );
    background-size: 80px 140px;
    background-position:
      0 0,
      0 0,
      40px 70px,
      40px 70px,
      0 0,
      40px 70px;
  }

  .bg-pattern-option.checker {
    background-image:
      repeating-linear-gradient(
        45deg,
        var(--neutral-dark-gray-op-50) 25%,
        transparent 25%,
        transparent 75%,
        var(--neutral-dark-gray-op-50) 75%,
        var(--neutral-dark-gray-op-50)
      ),
      repeating-linear-gradient(
        45deg,
        var(--neutral-dark-gray-op-50) 25%,
        var(--neutral-dark-gray-op-10) 25%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-50) 75%,
        var(--neutral-dark-gray-op-50)
      );
    background-position:
      0 0,
      15px 15px;
    background-size: 30px 30px;
  }

  .bg-pattern-option.crosses {
    background:
      radial-gradient(
        circle,
        transparent 20%,
        var(--neutral-gray) 20%,
        var(--neutral-gray) 80%,
        transparent 80%,
        transparent
      ),
      radial-gradient(
          circle,
          transparent 20%,
          var(--neutral-gray) 20%,
          var(--neutral-gray) 80%,
          transparent 80%,
          transparent
        )
        30px 30px,
      linear-gradient(var(--neutral-dark-gray) 2.6px, transparent 2.6px)
        0 -1.3px,
      linear-gradient(
          90deg,
          var(--neutral-dark-gray-op-50) 2.6px,
          var(--neutral-gray) 2.6px
        ) -1.3px
        0;
    background-size:
      60px 60px,
      60px 60px,
      30px 30px,
      30px 30px;
  }

  /* Apply background patterns to the entire editor */
  .editor.zigzag {
    background:
      linear-gradient(
          135deg,
          var(--neutral-dark-gray-op-10) 25%,
          transparent 25%
        ) -45px
        0/ 90px 90px,
      linear-gradient(
          225deg,
          var(--neutral-dark-gray-op-50) 25%,
          transparent 25%
        ) -45px
        0/ 90px 90px,
      linear-gradient(
          315deg,
          var(--neutral-dark-gray-op-10) 25%,
          transparent 25%
        )
        0px 0/ 90px 90px,
      linear-gradient(
          45deg,
          var(--neutral-dark-gray-op-50) 25%,
          var(--no-background) 25%
        )
        0px 0/ 90px 90px;
  }

  .editor.blocks {
    background-image:
      linear-gradient(
        30deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        150deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        30deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        150deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        60deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25.5%,
        transparent 75%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-10)
      ),
      linear-gradient(
        60deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25.5%,
        transparent 75%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-10)
      );
    background-size: 80px 140px;
    background-position:
      0 0,
      0 0,
      40px 70px,
      40px 70px,
      0 0,
      40px 70px;
  }

  .editor.checker {
    background-image:
      repeating-linear-gradient(
        45deg,
        var(--neutral-dark-gray-op-50) 25%,
        transparent 25%,
        transparent 75%,
        var(--neutral-dark-gray-op-50) 75%,
        var(--neutral-dark-gray-op-50)
      ),
      repeating-linear-gradient(
        45deg,
        var(--neutral-dark-gray-op-50) 25%,
        var(--neutral-dark-gray-op-10) 25%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-50) 75%,
        var(--neutral-dark-gray-op-50)
      );
    background-position:
      0 0,
      15px 15px;
    background-size: 30px 30px;
  }

  .editor.crosses {
    background:
      radial-gradient(
        circle,
        transparent 20%,
        var(--neutral-gray) 20%,
        var(--neutral-gray) 80%,
        transparent 80%,
        transparent
      ),
      radial-gradient(
          circle,
          transparent 20%,
          var(--neutral-gray) 20%,
          var(--neutral-gray) 80%,
          transparent 80%,
          transparent
        )
        30px 30px,
      linear-gradient(var(--neutral-dark-gray) 2.6px, transparent 2.6px)
        0 -1.3px,
      linear-gradient(
          90deg,
          var(--neutral-dark-gray) 2.6px,
          var(--neutral-gray) 2.6px
        ) -1.3px
        0;
    background-size:
      60px 60px,
      60px 60px,
      30px 30px,
      30px 30px;
  }
</style>
