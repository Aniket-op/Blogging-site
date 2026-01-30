'use client'

import React from "react"

import { useState, useRef, useEffect, useCallback } from 'react'
import type { ContentBlock } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Quote,
  Minus,
  List,
  ListOrdered,
  Code,
  GripVertical,
  Trash2,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'
import { ImageUpload } from '@/components/admin/image-upload'

interface BlockEditorCanvasProps {
  content: ContentBlock[]
  onChange: (content: ContentBlock[]) => void
}

const BLOCK_COMMANDS = [
  { command: '/text', label: 'Text', icon: Type, type: 'paragraph' },
  { command: '/h1', label: 'Heading 1', icon: Heading1, type: 'heading1' },
  { command: '/h2', label: 'Heading 2', icon: Heading2, type: 'heading2' },
  { command: '/h3', label: 'Heading 3', icon: Heading3, type: 'heading3' },
  { command: '/image', label: 'Image', icon: ImageIcon, type: 'image' },
  { command: '/quote', label: 'Quote', icon: Quote, type: 'quote' },
  { command: '/divider', label: 'Divider', icon: Minus, type: 'divider' },
  { command: '/list', label: 'Bullet List', icon: List, type: 'list' },
  { command: '/numbered', label: 'Numbered List', icon: ListOrdered, type: 'list-ordered' },
  { command: '/code', label: 'Code Block', icon: Code, type: 'code' },
]

export function BlockEditorCanvas({ content, onChange }: BlockEditorCanvasProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const createBlock = (type: string): ContentBlock => {
    const id = generateId()
    switch (type) {
      case 'paragraph':
        return { id, type: 'paragraph', content: '' }
      case 'heading1':
        return { id, type: 'heading1', content: '' }
      case 'heading2':
        return { id, type: 'heading2', content: '' }
      case 'heading3':
        return { id, type: 'heading3', content: '' }
      case 'image':
        return { id, type: 'image', src: '', alt: '', align: 'center' }
      case 'quote':
        return { id, type: 'quote', content: '' }
      case 'divider':
        return { id, type: 'divider' }
      case 'list':
        return { id, type: 'list', items: [''], ordered: false }
      case 'list-ordered':
        return { id, type: 'list', items: [''], ordered: true }
      case 'code':
        return { id, type: 'code', content: '' }
      default:
        return { id, type: 'paragraph', content: '' }
    }
  }

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newContent = [...content]
    newContent[index] = { ...newContent[index], ...updates } as ContentBlock
    onChange(newContent)
  }

  const addBlockAfter = (index: number, type: string = 'paragraph') => {
    const newContent = [...content]
    newContent.splice(index + 1, 0, createBlock(type))
    onChange(newContent)
  }

  const deleteBlock = (index: number) => {
    if (content.length === 1) {
      onChange([createBlock('paragraph')])
      return
    }
    const newContent = content.filter((_, i) => i !== index)
    onChange(newContent)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newContent = [...content]
    const [draggedItem] = newContent.splice(draggedIndex, 1)
    newContent.splice(targetIndex, 0, draggedItem)
    onChange(newContent)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-2">
      {content.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={e => handleDragOver(e, index)}
          onDragEnd={() => setDragOverIndex(null)}
          onDrop={() => handleDrop(index)}
          className={cn(
            'group relative',
            dragOverIndex === index && 'border-t-2 border-primary'
          )}
        >
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              type="button"
              className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <BlockEditor
            block={block}
            onUpdate={updates => updateBlock(index, updates)}
            onDelete={() => deleteBlock(index)}
            onAddAfter={type => addBlockAfter(index, type)}
          />
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => addBlockAfter(content.length - 1)}
        className="w-full border-2 border-dashed text-muted-foreground hover:text-foreground"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Block
      </Button>
    </div>
  )
}

interface BlockEditorProps {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
  onDelete: () => void
  onAddAfter: (type: string) => void
}

function BlockEditor({ block, onUpdate, onDelete, onAddAfter }: BlockEditorProps) {
  const [showCommands, setShowCommands] = useState(false)
  const [commandFilter, setCommandFilter] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  const filteredCommands = BLOCK_COMMANDS.filter(cmd =>
    cmd.command.includes(commandFilter.toLowerCase()) ||
    cmd.label.toLowerCase().includes(commandFilter.toLowerCase())
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent, value: string) => {
    if (e.key === '/' && value === '') {
      setShowCommands(true)
      setCommandFilter('')
    } else if (e.key === 'Escape') {
      setShowCommands(false)
    } else if (e.key === 'Enter' && !e.shiftKey && showCommands) {
      e.preventDefault()
      if (filteredCommands.length > 0) {
        onUpdate({ type: 'paragraph', content: '' } as Partial<ContentBlock>)
        onAddAfter(filteredCommands[0].type)
        setShowCommands(false)
      }
    } else if (e.key === 'Enter' && !e.shiftKey && !showCommands) {
      e.preventDefault()
      onAddAfter('paragraph')
    } else if (e.key === 'Backspace' && value === '' && !showCommands) {
      e.preventDefault()
      onDelete()
    }
  }, [showCommands, filteredCommands, onAddAfter, onDelete, onUpdate])

  const handleInput = (value: string) => {
    if (value.startsWith('/')) {
      setShowCommands(true)
      setCommandFilter(value)
    } else {
      setShowCommands(false)
      setCommandFilter('')
    }

    if ('content' in block) {
      onUpdate({ content: value })
    }
  }

  const selectCommand = (type: string) => {
    onUpdate({ type: 'paragraph', content: '' } as Partial<ContentBlock>)
    onAddAfter(type)
    setShowCommands(false)
    setCommandFilter('')
  }

  return (
    <div className="relative group">
      <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {block.type === 'paragraph' && (
        <div className="relative">
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={e => handleKeyDown(e, block.content)}
            placeholder="Type '/' for commands..."
            className="min-h-[40px] resize-none border-0 shadow-none focus-visible:ring-0 px-0 text-base"
            rows={1}
          />
          {showCommands && (
            <CommandMenu
              commands={filteredCommands}
              onSelect={selectCommand}
              onClose={() => setShowCommands(false)}
            />
          )}
        </div>
      )}

      {(block.type === 'heading1' || block.type === 'heading2' || block.type === 'heading3') && (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={block.content}
          onChange={e => onUpdate({ content: e.target.value })}
          onKeyDown={e => handleKeyDown(e, block.content)}
          placeholder={`Heading ${block.type.slice(-1)}`}
          className={cn(
            'border-0 shadow-none focus-visible:ring-0 px-0 font-bold',
            block.type === 'heading1' && 'text-3xl h-12',
            block.type === 'heading2' && 'text-2xl h-10',
            block.type === 'heading3' && 'text-xl h-9'
          )}
        />
      )}

      {block.type === 'image' && (
        <ImageBlockEditor block={block} onUpdate={onUpdate} />
      )}

      {block.type === 'quote' && (
        <div className="border-l-4 border-primary pl-4">
          <Textarea
            value={block.content}
            onChange={e => onUpdate({ content: e.target.value })}
            onKeyDown={e => handleKeyDown(e, block.content)}
            placeholder="Enter quote..."
            className="min-h-[40px] resize-none border-0 shadow-none focus-visible:ring-0 px-0 italic text-lg"
            rows={1}
          />
          <Input
            value={block.author || ''}
            onChange={e => onUpdate({ author: e.target.value })}
            placeholder="Author (optional)"
            className="border-0 shadow-none focus-visible:ring-0 px-0 text-sm text-muted-foreground mt-1"
          />
        </div>
      )}

      {block.type === 'divider' && (
        <hr className="my-4 border-border" />
      )}

      {block.type === 'list' && (
        <ListBlockEditor block={block} onUpdate={onUpdate} />
      )}

      {block.type === 'code' && (
        <Textarea
          value={block.content}
          onChange={e => onUpdate({ content: e.target.value })}
          placeholder="Enter code..."
          className="min-h-[80px] font-mono text-sm bg-muted rounded-lg"
          rows={3}
        />
      )}
    </div>
  )
}

interface CommandMenuProps {
  commands: typeof BLOCK_COMMANDS
  onSelect: (type: string) => void
  onClose: () => void
}

function CommandMenu({ commands, onSelect, onClose }: CommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-1 w-64 bg-popover border rounded-lg shadow-lg z-50 py-2"
    >
      <p className="px-3 py-1 text-xs text-muted-foreground font-medium">Insert Block</p>
      {commands.map(cmd => (
        <button
          key={cmd.command}
          type="button"
          onClick={() => onSelect(cmd.type)}
          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
        >
          <cmd.icon className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{cmd.label}</p>
            <p className="text-xs text-muted-foreground">{cmd.command}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

interface ImageBlockEditorProps {
  block: Extract<ContentBlock, { type: 'image' }>
  onUpdate: (updates: Partial<ContentBlock>) => void
}

function ImageBlockEditor({ block, onUpdate }: ImageBlockEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={block.src}
          onChange={e => onUpdate({ src: e.target.value })}
          placeholder="Image URL..."
          className="flex-1"
        />
        <ImageUpload compact onUploadComplete={(url) => onUpdate({ src: url })} />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              {block.align === 'left' && <AlignLeft className="w-4 h-4" />}
              {block.align === 'center' && <AlignCenter className="w-4 h-4" />}
              {block.align === 'right' && <AlignRight className="w-4 h-4" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex-1 gap-1">
              <Button
                variant={block.align === 'left' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onUpdate({ align: 'left' })}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={block.align === 'center' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onUpdate({ align: 'center' })}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={block.align === 'right' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onUpdate({ align: 'right' })}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {block.src && (
        <div className={cn(
          'relative',
          block.align === 'left' && 'text-left',
          block.align === 'center' && 'text-center',
          block.align === 'right' && 'text-right'
        )}>
          <img
            src={block.src || "/placeholder.svg"}
            alt={block.alt}
            className="max-w-full h-auto rounded-lg inline-block"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={block.alt}
          onChange={e => onUpdate({ alt: e.target.value })}
          placeholder="Alt text..."
          className="flex-1"
        />
        <Input
          value={block.caption || ''}
          onChange={e => onUpdate({ caption: e.target.value })}
          placeholder="Caption (optional)"
          className="flex-1"
        />
      </div>
    </div>
  )
}

interface ListBlockEditorProps {
  block: Extract<ContentBlock, { type: 'list' }>
  onUpdate: (updates: Partial<ContentBlock>) => void
}

function ListBlockEditor({ block, onUpdate }: ListBlockEditorProps) {
  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items]
    newItems[index] = value
    onUpdate({ items: newItems })
  }

  const addItem = (afterIndex: number) => {
    const newItems = [...block.items]
    newItems.splice(afterIndex + 1, 0, '')
    onUpdate({ items: newItems })
  }

  const removeItem = (index: number) => {
    if (block.items.length === 1) return
    const newItems = block.items.filter((_, i) => i !== index)
    onUpdate({ items: newItems })
  }

  return (
    <div className="space-y-1">
      {block.items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="w-6 text-muted-foreground text-sm">
            {block.ordered ? `${index + 1}.` : '•'}
          </span>
          <Input
            value={item}
            onChange={e => updateItem(index, e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addItem(index)
              } else if (e.key === 'Backspace' && item === '') {
                e.preventDefault()
                removeItem(index)
              }
            }}
            placeholder="List item..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
          />
        </div>
      ))}
    </div>
  )
}
