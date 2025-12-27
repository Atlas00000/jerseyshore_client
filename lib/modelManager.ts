import { ShirtModel } from '@/types/models';

/**
 * Model Manager for managing multiple shirt models (blank + branded)
 */
class ModelManager {
  private models: Map<string, ShirtModel> = new Map();

  /**
   * Register a model
   * @param model - Shirt model configuration
   */
  registerModel(model: ShirtModel): void {
    this.models.set(model.id, model);
  }

  /**
   * Register multiple models
   * @param models - Array of shirt model configurations
   */
  registerModels(models: ShirtModel[]): void {
    models.forEach((model) => this.registerModel(model));
  }

  /**
   * Get a model by ID
   * @param id - Model ID
   * @returns ShirtModel or undefined if not found
   */
  getModel(id: string): ShirtModel | undefined {
    return this.models.get(id);
  }

  /**
   * Get all models
   * @returns Array of all registered models
   */
  getAllModels(): ShirtModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get models by type
   * @param type - Model type ('blank' or 'branded')
   * @returns Array of models matching the type
   */
  getModelsByType(type: 'blank' | 'branded'): ShirtModel[] {
    return Array.from(this.models.values()).filter((model) => model.type === type);
  }

  /**
   * Get models by brand
   * @param brand - Brand name
   * @returns Array of models for the brand
   */
  getModelsByBrand(brand: string): ShirtModel[] {
    return Array.from(this.models.values()).filter(
      (model) => model.type === 'branded' && model.brand === brand
    );
  }

  /**
   * Get available brands
   * @returns Array of unique brand names
   */
  getAvailableBrands(): string[] {
    const brands = Array.from(this.models.values())
      .filter((model) => model.brand)
      .map((model) => model.brand!);
    return Array.from(new Set(brands));
  }

  /**
   * Remove a model
   * @param id - Model ID
   */
  removeModel(id: string): void {
    this.models.delete(id);
  }

  /**
   * Clear all models
   */
  clearModels(): void {
    this.models.clear();
  }

  /**
   * Get model count
   */
  getModelCount(): number {
    return this.models.size;
  }
}

// Singleton instance
export const modelManager = new ModelManager();

