/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  BaseSelection,
  EditorState,
  EditorThemeClasses,
  Klass,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedTextNode,
  Spread
} from 'lexical'

import { afterEach, beforeEach } from 'vitest'

import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { $isRangeSelection, DecoratorNode, ElementNode, TextNode, createEditor } from 'lexical'
import * as React from 'react'
import { createRef } from 'react'
import { createRoot } from 'react-dom/client'
import * as ReactTestUtils from 'react-dom/test-utils'

import { defaultMdxOptionValues } from '../'

let _keyCounter = 1

export function resetRandomKey(): void {
  _keyCounter = 1
}

type TestEnv = {
  container: HTMLDivElement | null
  editor: LexicalEditor | null
  outerHTML: string
}

export function initializeUnitTest(runTests: (testEnv: TestEnv) => void, editorConfig = {}) {
  const testEnv: TestEnv = {
    container: null,
    editor: null,

    get outerHTML() {
      return this.container!.innerHTML
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeEach(async () => {
    resetRandomKey()

    testEnv.container = document.createElement('div')
    document.body.appendChild(testEnv.container)
    const ref = createRef<HTMLDivElement>()

    const useLexicalEditor = (rootElementRef: React.RefObject<HTMLDivElement>) => {
      const lexicalEditor = React.useMemo(() => {
        const lexical = createTestEditor(editorConfig)
        return lexical
      }, [])

      React.useEffect(() => {
        const rootElement = rootElementRef.current
        lexicalEditor.setRootElement(rootElement)
      }, [rootElementRef, lexicalEditor])
      return lexicalEditor
    }

    const Editor = () => {
      testEnv.editor = useLexicalEditor(ref)
      return <div ref={ref} contentEditable={true} />
    }

    ReactTestUtils.act(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      createRoot(testEnv.container!).render(<Editor />)
    })
  })

  afterEach(() => {
    document.body.removeChild(testEnv.container!)
    testEnv.container = null
  })

  runTests(testEnv)
}

export function initializeClipboard() {
  Object.defineProperty(window, 'DragEvent', {
    value: class DragEvent {}
  })
  Object.defineProperty(window, 'ClipboardEvent', {
    value: class ClipboardEvent {}
  })
}

export type SerializedTestElementNode = Spread<
  {
    type: 'test_block'
    version: 1
  },
  SerializedElementNode
>

export class TestElementNode extends ElementNode {
  static getType(): string {
    return 'test_block'
  }

  static clone(node: TestElementNode) {
    return new TestElementNode(node.__key)
  }

  static importJSON(serializedNode: SerializedTestElementNode): TestInlineElementNode {
    const node = $createTestInlineElementNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportJSON(): SerializedTestElementNode {
    return {
      ...super.exportJSON(),
      type: 'test_block',
      version: 1
    }
  }

  createDOM() {
    return document.createElement('div')
  }

  updateDOM() {
    return false
  }
}

export function $createTestElementNode(): TestElementNode {
  return new TestElementNode()
}

type SerializedTestTextNode = Spread<{ type: 'test_text'; version: 1 }, SerializedTextNode>
export class TestTextNode extends TextNode {
  static getType() {
    return 'test_text'
  }

  static clone(node: TestTextNode): TestTextNode {
    //@ts-ignore
    return new TestTextNode(node.__text, node.__key)
  }

  static importJSON(serializedNode: SerializedTestTextNode): TestTextNode {
    //@ts-ignore
    return new TestTextNode(serializedNode.__text as string)
  }

  exportJSON(): SerializedTestTextNode {
    return {
      ...super.exportJSON(),
      type: 'test_text',
      version: 1
    }
  }
}

export type SerializedTestInlineElementNode = Spread<
  {
    type: 'test_inline_block'
    version: 1
  },
  SerializedElementNode
>

export class TestInlineElementNode extends ElementNode {
  static getType(): string {
    return 'test_inline_block'
  }

  static clone(node: TestInlineElementNode) {
    return new TestInlineElementNode(node.__key)
  }

  static importJSON(serializedNode: SerializedTestInlineElementNode): TestInlineElementNode {
    const node = $createTestInlineElementNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportJSON(): SerializedTestInlineElementNode {
    return {
      ...super.exportJSON(),
      type: 'test_inline_block',
      version: 1
    }
  }

  createDOM() {
    return document.createElement('a')
  }

  updateDOM() {
    return false
  }

  isInline() {
    return true
  }
}

export function $createTestInlineElementNode(): TestInlineElementNode {
  return new TestInlineElementNode()
}

export type SerializedTestSegmentedNode = Spread<
  {
    type: 'test_segmented'
    version: 1
  },
  SerializedTextNode
>

export class TestSegmentedNode extends TextNode {
  static getType(): string {
    return 'test_segmented'
  }

  static clone(node: TestSegmentedNode): TestSegmentedNode {
    return new TestSegmentedNode(node.__text, node.__key)
  }

  static importJSON(serializedNode: SerializedTestSegmentedNode): TestSegmentedNode {
    const node = $createTestSegmentedNode(serializedNode.text)
    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)
    return node
  }

  exportJSON(): SerializedTestSegmentedNode {
    return {
      ...super.exportJSON(),
      type: 'test_segmented',
      version: 1
    }
  }
}

export function $createTestSegmentedNode(text: string): TestSegmentedNode {
  return new TestSegmentedNode(text).setMode('segmented')
}

export type SerializedTestExcludeFromCopyElementNode = Spread<
  {
    type: 'test_exclude_from_copy_block'
    version: 1
  },
  SerializedElementNode
>

export class TestExcludeFromCopyElementNode extends ElementNode {
  static getType(): string {
    return 'test_exclude_from_copy_block'
  }

  static clone(node: TestExcludeFromCopyElementNode) {
    return new TestExcludeFromCopyElementNode(node.__key)
  }

  static importJSON(serializedNode: SerializedTestExcludeFromCopyElementNode): TestExcludeFromCopyElementNode {
    const node = $createTestExcludeFromCopyElementNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportJSON(): SerializedTestExcludeFromCopyElementNode {
    return {
      ...super.exportJSON(),
      type: 'test_exclude_from_copy_block',
      version: 1
    }
  }

  createDOM() {
    return document.createElement('div')
  }

  updateDOM() {
    return false
  }

  excludeFromCopy() {
    return true
  }
}

export function $createTestExcludeFromCopyElementNode(): TestExcludeFromCopyElementNode {
  return new TestExcludeFromCopyElementNode()
}

export type SerializedTestDecoratorNode = Spread<
  {
    type: 'test_decorator'
    version: 1
  },
  SerializedLexicalNode
>

export class TestDecoratorNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return 'test_decorator'
  }

  static clone(node: TestDecoratorNode) {
    return new TestDecoratorNode(node.__key)
  }

  static importJSON(_serializedNode: SerializedTestDecoratorNode): TestDecoratorNode {
    return $createTestDecoratorNode()
  }

  exportJSON(): SerializedTestDecoratorNode {
    return {
      ...super.exportJSON(),
      type: 'test_decorator',
      version: 1
    }
  }

  static importDOM() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      'test-decorator': (_domNode: HTMLElement) => {
        return {
          conversion: () => ({ node: $createTestDecoratorNode() })
        }
      }
    }
  }

  exportDOM() {
    return {
      element: document.createElement('test-decorator')
    }
  }

  getTextContent() {
    return 'Hello world'
  }

  createDOM() {
    return document.createElement('span')
  }

  updateDOM() {
    return false
  }

  decorate() {
    return <Decorator text={'Hello world'} />
  }
}

function Decorator({ text }: { text: string }): JSX.Element {
  return <span>{text}</span>
}

export function $createTestDecoratorNode(): TestDecoratorNode {
  return new TestDecoratorNode()
}

// poor man's array unique
const DEFAULT_NODES = Array.from(
  new Set([
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    TestElementNode,
    TestSegmentedNode,
    TestExcludeFromCopyElementNode,
    TestDecoratorNode,
    TestInlineElementNode,
    TestTextNode,
    HorizontalRuleNode,
    ...Object.values(defaultMdxOptionValues.defaultLexicalNodes)
  ])
)

export function createTestEditor(
  config: {
    namespace?: string
    editorState?: EditorState
    theme?: EditorThemeClasses
    parentEditor?: LexicalEditor
    nodes?: ReadonlyArray<
      | Klass<LexicalNode>
      | {
          replace: Klass<LexicalNode>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          with: <T extends { new (...args: any): any }>(node: InstanceType<T>) => LexicalNode
        }
    >
    onError?: (error: Error) => void
    disableEvents?: boolean
    readOnly?: boolean
  } = {}
): LexicalEditor {
  const customNodes = config.nodes || []
  const editor = createEditor({
    namespace: config.namespace,
    onError: (e) => {
      throw e
    },
    ...config,
    // @ts-ignore
    nodes: DEFAULT_NODES.concat(customNodes)
  })
  return editor
}

export function $assertRangeSelection(selection: BaseSelection): RangeSelection {
  if (!$isRangeSelection(selection)) {
    throw new Error(`Expected RangeSelection, got ${selection}`)
  }
  return selection
}
