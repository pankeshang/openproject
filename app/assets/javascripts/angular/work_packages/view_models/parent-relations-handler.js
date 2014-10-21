//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2014 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

module.exports = function(CommonRelationsHandler, WorkPackageService, ApiHelper) {
  function ParentRelationsHandler(workPackage, parents, relationsId) {
      var handler = new CommonRelationsHandler(workPackage, parents, relationsId);

      handler.type = "parent";
      handler.addRelation = undefined;
      handler.isSingletonRelation = true;
      handler.relationsId = relationsId;

      handler.canAddRelation = function() { return !!this.workPackage.links.update; };
      handler.canDeleteRelation = function() { return !!this.workPackage.links.update; };
      handler.getRelatedWorkPackage = function(workPackage, relation) { return relation.fetch() };
      handler.addRelation = function(scope) {
          WorkPackageService.updateWorkPackage(this.workPackage, {parentId: scope.relationToAddId}).then(function(workPackage) {
              scope.relationToAddId = '';
              scope.updateFocus(-1);
              scope.$emit('workPackageRefreshRequired', '');
          }, function(error) {
              ApiHelper.handleError(scope, error);
          });
      };
      handler.removeRelation = function(scope) {
          var index = this.relations.indexOf(scope.relation);
          var handler = this;

          WorkPackageService.updateWorkPackage(scope.workPackage, {parentId: null}).then(function(response){
              handler.relations.splice(index, 1);
              scope.updateFocus(index);
          }, function(error) {
              ApiHelper.handleError(scope, error);
          });
      };

      return handler;
  }

  return ParentRelationsHandler;
}