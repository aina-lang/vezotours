import { palette } from "@/constants/palette";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function Checkbox({ className = '', ...props }) {
    const { paletteName } = useThemeContext(); // Get palette name
    const currentPalette = palette[paletteName];
    // Access the current palette
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800 ' +
                className
            }
        />
    );
}
