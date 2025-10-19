import {
  Box,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { FilterCategory, SelectedFilters } from '../../models/category';

interface OptionalFiltersProps {
  filters: FilterCategory[];
  selectedFilters: SelectedFilters;
  onFilterChange: (filterType: keyof SelectedFilters, value: string, checked: boolean) => void;
  onFilterRemove: (filterType: keyof SelectedFilters, value: string) => void;
  onClearAll: () => void;
}

export default function OptionalFilters({
  filters,
  selectedFilters,
  onFilterChange,
  onFilterRemove,
  onClearAll,
}: OptionalFiltersProps) {
  const getSelectedValues = (filterType: keyof SelectedFilters): string[] => {
    return selectedFilters[filterType] || [];
  };

  const isFilterSelected = (filterType: keyof SelectedFilters, value: string): boolean => {
    return getSelectedValues(filterType).includes(value);
  };


  const getActiveFilters = () => {
    const active: Array<{ type: keyof SelectedFilters; value: string; label: string }> = [];
    
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        const filterType = key as keyof SelectedFilters;
        const filter = filters.find(f => f.id === filterType);
        if (filter) {
          values.forEach((value: string) => {
            const option = filter.options.find(opt => opt.value === value);
            if (option) {
              active.push({
                type: filterType,
                value,
                label: option.label,
              });
            }
          });
        }
      }
    });
    
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Филтри
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              Активни филтри:
            </Typography>
            <Tooltip title="Исчисти сите филтри">
              <IconButton
                size="small"
                onClick={onClearAll}
                color="secondary"
                sx={{ ml: 1 }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={`${filter.type}-${filter.value}-${index}`}
                label={filter.label}
                onDelete={() => onFilterRemove(filter.type, filter.value)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Filter Options */}
      <FormGroup>
        {filters.map((filter) => (
          <Box key={filter.id} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {filter.label}
            </Typography>
            <Box sx={{ pl: 2 }}>
              {filter.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      checked={isFilterSelected(filter.id as keyof SelectedFilters, option.value)}
                      onChange={(e) => 
                        onFilterChange(
                          filter.id as keyof SelectedFilters, 
                          option.value, 
                          e.target.checked
                        )
                      }
                      size="small"
                    />
                  }
                  label={option.label}
                />
              ))}
            </Box>
          </Box>
        ))}
      </FormGroup>
    </Paper>
  );
}
