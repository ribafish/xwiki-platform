/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
package org.xwiki.livedata.internal;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;

import org.xwiki.component.annotation.Component;
import org.xwiki.component.annotation.InstantiationStrategy;
import org.xwiki.component.descriptor.ComponentInstantiationStrategy;
import org.xwiki.livedata.LiveDataEntryStore;
import org.xwiki.livedata.LiveDataPropertyDescriptorStore;
import org.xwiki.livedata.LiveDataSource;
import org.xwiki.livedata.WithParameters;

/**
 * {@link LiveDataSource} implementation that reuses existing live table data.
 * 
 * @version $Id$
 * @since 12.6RC1
 */
@Component
@Named("liveTable")
@InstantiationStrategy(ComponentInstantiationStrategy.PER_LOOKUP)
public class LiveTableLiveDataSource implements LiveDataSource, WithParameters
{
    @Inject
    @Named("liveTable")
    private LiveDataEntryStore entryStore;

    @Inject
    @Named("liveTable/property")
    private LiveDataPropertyDescriptorStore propertyStore;

    @Inject
    @Named("liveTable/propertyType")
    private LiveDataPropertyDescriptorStore propertyTypeStore;

    private final Map<String, Object> parameters = new HashMap<>();

    @Override
    public LiveDataEntryStore getEntries()
    {
        if (this.entryStore instanceof WithParameters) {
            ((WithParameters) this.entryStore).getParameters().putAll(this.parameters);
        }
        return this.entryStore;
    }

    @Override
    public LiveDataPropertyDescriptorStore getProperties()
    {
        if (this.propertyStore instanceof WithParameters) {
            ((WithParameters) this.propertyStore).getParameters().putAll(this.parameters);
        }
        return this.propertyStore;
    }

    @Override
    public LiveDataPropertyDescriptorStore getPropertyTypes()
    {
        if (this.propertyTypeStore instanceof WithParameters) {
            ((WithParameters) this.propertyTypeStore).getParameters().putAll(this.parameters);
        }
        return this.propertyTypeStore;
    }

    @Override
    public Map<String, Object> getParameters()
    {
        return this.parameters;
    }
}
