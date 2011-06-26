module ApplicationHelper
  def current?(page_name)
    "current" if current_page?(:action => page_name)
  end
end
