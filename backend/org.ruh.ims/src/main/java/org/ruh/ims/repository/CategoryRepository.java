package org.ruh.ims.repository;

import org.ruh.ims.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
