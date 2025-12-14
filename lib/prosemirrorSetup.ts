/**
 * ProseMirror Editor Setup
 * 
 * Configures the ProseMirror editor with schema, plugins, and keymaps.
 */

import { Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';

/**
 * Create the editor schema
 * Using the basic schema which includes: doc, paragraph, text, heading, etc.
 */
export const editorSchema = new Schema({
  nodes: basicSchema.spec.nodes,
  marks: basicSchema.spec.marks,
});

/**
 * Create basic keymap for the editor
 * Includes common keyboard shortcuts
 */
export function createKeymap() {
  return keymap({
    ...baseKeymap,
    'Mod-z': undo,
    'Mod-y': redo,
    'Mod-Shift-z': redo,
  });
}

/**
 * Create a plugin to handle text updates
 * This allows us to notify React when the content changes
 */
export function createUpdatePlugin(onUpdate: (text: string) => void): Plugin {
  return new Plugin({
    view() {
      return {
        update: (view: EditorView, prevState: EditorState) => {
          const { state } = view;
          if (!state.doc.eq(prevState.doc)) {
            const text = state.doc.textContent;
            onUpdate(text);
          }
        },
      };
    },
  });
}

/**
 * Create the editor state with all plugins
 */
export function createEditorState(
  content: string = '',
  onUpdate: (text: string) => void
): EditorState {
  return EditorState.create({
    doc: content ? editorSchema.nodeFromJSON({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: content ? [{ type: 'text', text: content }] : undefined,
        },
      ],
    }) : undefined,
    schema: editorSchema,
    plugins: [
      history(),
      createKeymap(),
      createUpdatePlugin(onUpdate),
    ],
  });
}

/**
 * Insert text at the end of the document
 * Used to append AI-generated text
 */
export function insertTextAtEnd(view: EditorView, text: string): void {
  const { state } = view;
  const { tr, doc } = state;
  
  // Get the position before the document end (doc.content.size - 1)
  // ProseMirror documents have boundaries, so we insert before the end boundary
  const endPos = doc.content.size - 1;
  
  // Add a space before the text for natural flow (unless text starts with punctuation)
  const textToInsert = /^[.,!?;:]/.test(text.trim()) ? text : ' ' + text;
  
  // Create a text node
  const textNode = editorSchema.text(textToInsert);
  
  // Insert the text at the end
  const transaction = tr.insert(endPos, textNode);
  
  // Apply the transaction
  view.dispatch(transaction);
  
  // Focus the editor and move cursor to end
  view.focus();
  
  // Move cursor to the end
  const newEndPos = view.state.doc.content.size - 1;
  const newTr = view.state.tr.setSelection(
    view.state.selection.constructor.near(view.state.doc.resolve(newEndPos))
  );
  view.dispatch(newTr);
}

/**
 * Insert text with typing animation effect
 * Adds characters one by one with a delay for a realistic typing effect
 */
export async function insertTextWithTypingEffect(
  view: EditorView,
  text: string,
  typingSpeed: number = 30 // milliseconds per character
): Promise<void> {
  const { state } = view;
  const { doc } = state;
  
  // Add a space before the text for natural flow (unless text starts with punctuation)
  const textToInsert = /^[.,!?;:]/.test(text.trim()) ? text : ' ' + text;
  
  // Get starting position
  let currentPos = doc.content.size - 1;
  
  // Insert characters one by one
  for (let i = 0; i < textToInsert.length; i++) {
    const char = textToInsert[i];
    
    // Create a text node for this character
    const charNode = editorSchema.text(char);
    
    // Insert the character
    const tr = view.state.tr.insert(currentPos, charNode);
    view.dispatch(tr);
    
    // Update position for next character
    currentPos += 1;
    
    // Wait before inserting next character
    // Vary speed slightly for more natural effect
    const variance = Math.random() * 10 - 5; // -5 to +5 ms variation
    const delay = typingSpeed + variance;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // Focus the editor and move cursor to end
  view.focus();
  const finalPos = view.state.doc.content.size - 1;
  const finalTr = view.state.tr.setSelection(
    view.state.selection.constructor.near(view.state.doc.resolve(finalPos))
  );
  view.dispatch(finalTr);
}

/**
 * Get the current text content from the editor
 */
export function getTextContent(view: EditorView): string {
  return view.state.doc.textContent;
}

/**
 * Set the entire document content
 * Useful for resetting or initializing the editor
 */
export function setContent(view: EditorView, content: string): void {
  const { state } = view;
  const { tr, schema } = state;
  
  const doc = schema.nodeFromJSON({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: content ? [{ type: 'text', text: content }] : undefined,
      },
    ],
  });
  
  const transaction = tr.replaceWith(0, state.doc.content.size, doc.content);
  view.dispatch(transaction);
}

/**
 * Create editor view configuration
 */
export interface EditorViewConfig {
  state: EditorState;
  mount: HTMLElement;
  onUpdate?: (text: string) => void;
}

/**
 * Helper to create an EditorView with common configuration
 */
export function createEditorView(config: EditorViewConfig): EditorView {
  return new EditorView(config.mount, {
    state: config.state,
    dispatchTransaction(transaction: Transaction) {
      const newState = this.state.apply(transaction);
      this.updateState(newState);
      
      if (config.onUpdate && transaction.docChanged) {
        config.onUpdate(newState.doc.textContent);
      }
    },
  });
}

