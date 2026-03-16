import React from 'react';
import { BlockProps } from '@/lib/blocks/registry';

export const DividerBlock: React.FC<BlockProps> = ({ id, isEditMode, styles }) => {
    return (
        <div className="flex h-full items-center justify-center py-2">
            <hr className="w-full border-t border-zinc-200" style={styles} />
        </div>
    );
};
