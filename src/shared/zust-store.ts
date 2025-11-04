import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IMainState } from './types'
// import type {} from '@redux-devtools/extension' // required for devtools typing

export const useMainStore = create<IMainState>()(

    persist(
        (set) => ({
            active_note: null as any,
            set_state: (title, value) => {
                switch (title) {
                    case 'active_note':
                        set((state) => ({ active_note: value }));

                        break;

                    default:
                        break;
                }
            },
        }),
        {
            name: 'app-main-state',
        },

    ),
)