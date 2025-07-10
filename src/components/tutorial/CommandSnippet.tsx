import { useState } from 'react';
import type { Command } from '../../types/tutorial';

interface CommandSnippetProps {
  command: Command;
  onCopy?: (command: string) => void;
}

export function CommandSnippet({ command, onCopy }: CommandSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command.command);
      setCopied(true);
      onCopy?.(command.command);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Failed to copy command:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 my-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <span className="text-sm text-gray-400">
            {command.environment && `[${command.environment}]`}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      
      <div className="font-mono text-sm mb-2">
        <code>{command.command}</code>
      </div>
      
      <div className="text-sm text-gray-400">
        {command.description}
      </div>
      
      {command.workingDirectory && (
        <div className="text-xs text-yellow-400 mt-1">
          Working directory: {command.workingDirectory}
        </div>
      )}
      
      {command.expectedOutput && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Expected output:</div>
          <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded">
            {command.expectedOutput}
          </div>
        </div>
      )}
    </div>
  );
}