import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import PrioritySelector from '../PrioritySelector.vue'

describe('PrioritySelector', () => {
  it('renders all priority options', () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })

    const buttons = wrapper.findAll('[role="button"]')
    expect(buttons).toHaveLength(3)
    
    expect(buttons[0].text()).toContain('Critical')
    expect(buttons[1].text()).toContain('Moderate')
    expect(buttons[2].text()).toContain('Optional')
  })

  it('shows selected priority as pressed', () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'critical' }
    })

    const criticalButton = wrapper.findAll('[role="button"]')[0]
    const moderateButton = wrapper.findAll('[role="button"]')[1]
    
    expect(criticalButton.attributes('aria-pressed')).toBe('true')
    expect(moderateButton.attributes('aria-pressed')).toBe('false')
  })

  it('emits update:modelValue when priority is selected', async () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })

    const optionalButton = wrapper.findAll('[role="button"]')[2]
    await optionalButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('optional')
  })

  it('handles keyboard navigation with Enter', async () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })

    const criticalButton = wrapper.findAll('[role="button"]')[0]
    await criticalButton.trigger('keydown.enter')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('critical')
  })

  it('handles keyboard navigation with Space', async () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })

    const optionalButton = wrapper.findAll('[role="button"]')[2]
    await optionalButton.trigger('keydown.space')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('optional')
  })

  it('handles radio input keyboard navigation', async () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })

    const radioInput = wrapper.findAll('input[type="radio"]')[0]
    await radioInput.trigger('keydown.enter')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('critical')
  })

  it('applies compact styling when compact prop is true', () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate', compact: true }
    })

    const button = wrapper.find('[role="button"]')
    expect(button.classes()).toContain('px-2')
    expect(button.classes()).toContain('py-1')
    
    const text = wrapper.find('span')
    expect(text.classes()).toContain('text-xs')
  })

  it('applies default styling when compact prop is false', () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate', compact: false }
    })

    const button = wrapper.find('[role="button"]')
    expect(button.classes()).toContain('px-3')
    expect(button.classes()).toContain('py-2')
    
    const text = wrapper.find('span')
    expect(text.classes()).toContain('text-sm')
  })

  it('uses custom name for radio inputs', () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate', name: 'custom-name' }
    })

    const radioInputs = wrapper.findAll('input[type="radio"]')
    radioInputs.forEach(input => {
      expect(input.attributes('name')).toBe('priority-custom-name')
    })
  })

  it('generates unique name when not provided', () => {
    const wrapper1 = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })
    const wrapper2 = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })

    const radio1 = wrapper1.find('input[type="radio"]')
    const radio2 = wrapper2.find('input[type="radio"]')

    expect(radio1.attributes('name')).not.toBe(radio2.attributes('name'))
    expect(radio1.attributes('name')).toMatch(/^priority-/)
    expect(radio2.attributes('name')).toMatch(/^priority-/)
  })

  it('shows priority indicators with correct classes', () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate' }
    })

    const indicators = wrapper.findAll('[aria-hidden="true"]')
    expect(indicators[0].classes()).toContain('bg-priority-critical')
    expect(indicators[1].classes()).toContain('bg-priority-moderate')
    expect(indicators[2].classes()).toContain('bg-priority-optional')
  })

  it('shows compact indicators when compact prop is true', () => {
    const wrapper = mount(PrioritySelector, {
      props: { modelValue: 'moderate', compact: true }
    })

    const indicators = wrapper.findAll('[aria-hidden="true"]')
    indicators.forEach(indicator => {
      expect(indicator.classes()).toContain('w-2')
      expect(indicator.classes()).toContain('h-2')
    })
  })
})
