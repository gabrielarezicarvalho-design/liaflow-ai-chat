import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Sorrisos",
    emojis: [
      "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙",
      "😋","😛","😜","🤪","😝","🤗","🤭","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","😮","😯","😴","🤤",
      "😪","😵","🤐","🥴","🤢","🤧","😷","🤒","🤕","🥳","🥺","😢","😭","😤","😠","😡","🤬","😳","😱","😨",
    ],
  },
  {
    label: "Gestos",
    emojis: [
      "👍","👎","👌","🤌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝",
      "🙏","💪","🦾","✍️","👏","🙌","👐","🤲","💅","👀","🧠","❤️","🧡","💛","💚","💙","💜","🖤","🤍","💔",
    ],
  },
  {
    label: "Objetos",
    emojis: [
      "🔥","✨","⭐","🌟","💥","💯","✅","❌","⚠️","❗","❓","💬","📌","📎","📝","📅","⏰","⌛","📞","📱",
      "💻","🖥️","📷","🎥","🎧","🎵","🎉","🎊","🎁","🏆","💰","💳","🛒","📦","🚀","📈","📉","🔒","🔑","🔔",
    ],
  },
  {
    label: "Outros",
    emojis: [
      "☕","🍕","🍔","🍟","🌮","🍩","🍰","🍎","🍌","🥤","🍺","🥂","🐶","🐱","🐭","🐰","🦊","🐻","🐼","🐨",
      "🌞","🌙","⛅","🌧️","🌈","🌊","🌴","🌵","🌸","🌻","🚗","✈️","🏠","🏢","⚽","🏀","🎮","🎯","🧩","🎲",
    ],
  },
];

interface EmojiPickerPopoverProps {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
  className?: string;
}

export const EmojiPickerPopover = ({ onSelect, disabled, className }: EmojiPickerPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState(0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn("h-9 w-9 shrink-0 text-muted-foreground hover:text-primary", className)}
          aria-label="Inserir emoji"
        >
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-[320px] p-2">
        <div className="mb-2 flex items-center gap-1">
          {EMOJI_GROUPS.map((g, i) => (
            <Button
              key={g.label}
              type="button"
              variant={i === group ? "secondary" : "ghost"}
              size="sm"
              className="h-7 flex-1 px-1 text-[11px]"
              onClick={() => setGroup(i)}
            >
              {g.label}
            </Button>
          ))}
        </div>
        <ScrollArea className="h-52">
          <div className="grid grid-cols-8 gap-1 pr-2">
            {EMOJI_GROUPS[group].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-md text-xl transition-colors hover:bg-muted"
              >
                {emoji}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
