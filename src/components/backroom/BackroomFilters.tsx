import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface BackroomFiltersProps {
  selectedCategory: string;
  selectedSeason: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onSeasonChange: (season: string) => void;
  onSortChange: (sort: string) => void;
  categories: string[];
  seasons: string[];
}

export const BackroomFilters = ({
  selectedCategory,
  selectedSeason,
  selectedSort,
  onCategoryChange,
  onSeasonChange,
  onSortChange,
  categories,
  seasons,
}: BackroomFiltersProps) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === "All" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/20 transition-colors"
          onClick={() => onCategoryChange("All")}
        >
          All Categories
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedSeason} onValueChange={onSeasonChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Seasons</SelectItem>
            {seasons.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetical">Alphabetical A-Z</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="popular">Most Saved</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
