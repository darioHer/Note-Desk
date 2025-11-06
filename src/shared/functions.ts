import type { INoteData, TNote } from "@/shared/types";

export const userFriendlyTime = (t_stamp: number) => {
    const aWeekTS = 1000 * 60 * 60 * 24 * 7;
    const aDayTS = 1000 * 60 * 60 * 24;
    const aWeekAgo = Date.now() - aWeekTS;
    const aDayAgo = Date.now() - aDayTS;

    // getDay(): 0=Dom, 1=Lun, ..., 6=Sáb
    const week_day_to_str = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    if (t_stamp > aWeekAgo) {
        if (t_stamp < aDayAgo) {
            return week_day_to_str[new Date(t_stamp).getDay()];
        }
        return new Date(t_stamp).toTimeString().slice(0, 5);
    }

    return new Date(t_stamp).toLocaleDateString();
};

export const sectionze_notes = (notes: INoteData[]) => {
    
    const parsed_notes: INoteData[] = notes.map((n) => {
        let parsed: TNote | null = null;

        if (typeof n.note === 'string') {
            try { parsed = JSON.parse(n.note) as TNote; } catch { parsed = null; }
        } else {
            parsed = n.note as TNote;
        }

        const safe: TNote = parsed && Array.isArray(parsed.blocks)
            ? parsed
            : { time: Date.now(), blocks: [], version: '2.28.2' };

        return { ...n, note: safe };
    });

    const aDayAgo = Date.now() - (1000 * 60 * 60 * 24);
    const twoDaysAgo = Date.now() - (1000 * 60 * 60 * 48);

    const todays_notes = parsed_notes.filter(n => (n.note as TNote).time > aDayAgo);
    const yesterday_notes = parsed_notes.filter(n => (n.note as TNote).time <= aDayAgo && (n.note as TNote).time > twoDaysAgo);
    const previous_notes = parsed_notes.filter(n => (n.note as TNote).time <= twoDaysAgo);

    return { today: todays_notes, yesterday: yesterday_notes, previous: previous_notes };
};
